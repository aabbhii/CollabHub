import express from "express";
import { createServer as createViteServer } from "vite";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./src/backend/config/database";
import { AuthController } from "./src/backend/controllers/authController";
import { StudySessionController, TaskController, ProfileController } from "./src/backend/controllers/index";
import { authMiddleware, AuthRequest } from "./src/backend/middleware/authMiddleware";
import { Notification } from "./src/backend/models";
import { Response } from "express";

dotenv.config();

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Database Connection
  try {
    await db.authenticate();
    console.log("Database connected successfully to Aiven MySQL.");
    if (process.env.NODE_ENV !== "production") {
      await db.sync({ alter: true });
      console.log("Database models synced.");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "CollabStudy API is running" });
  });

  // Auth Routes
  app.post("/api/auth/register", AuthController.register);
  app.post("/api/auth/login", AuthController.login);

  // Study Session Routes
  app.post("/api/sessions", authMiddleware as any, StudySessionController.create);
  app.get("/api/sessions", authMiddleware as any, StudySessionController.getAll);
  app.get("/api/sessions/:id", authMiddleware as any, StudySessionController.getById);

  // Task Routes
  app.post("/api/tasks", authMiddleware as any, TaskController.create);
  app.patch("/api/tasks/:id/status", authMiddleware as any, TaskController.updateStatus);

  // Profile Routes
  app.get("/api/profile", authMiddleware as any, ProfileController.getProfile);
  app.put("/api/profile", authMiddleware as any, ProfileController.updateProfile);
  app.get("/api/leaderboard", ProfileController.getLeaderboard);

  // Notification Routes
  app.get("/api/notifications", authMiddleware as any, async (req: AuthRequest, res: Response) => {
    try {
      const notifications = await Notification.findAll({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]],
        limit: 10
      });
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // WebSocket Logic
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join-session", (sessionId) => {
      socket.join(`session-${sessionId}`);
      console.log(`User joined session: ${sessionId}`);
    });

    socket.on("task-update", (data) => {
      io.to(`session-${data.sessionId}`).emit("task-updated", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
