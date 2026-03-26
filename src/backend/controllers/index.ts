import { Request, Response } from "express";
import { StudySession, SessionMember, Task, User, Profile } from "../models";
import { AuthRequest } from "../middleware/authMiddleware";
import { GamificationService } from "../services/gamificationService";

export class StudySessionController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const { title, description, deadline } = req.body;
      const session = await StudySession.create({
        title,
        description,
        deadline,
        creatorId: req.user.id
      });

      await SessionMember.create({
        sessionId: session.id,
        userId: req.user.id,
        role: "OWNER"
      });

      await GamificationService.addXP(req.user.id, 50, "creating a study session");

      res.status(201).json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      const sessions = await StudySession.findAll({
        include: [
          { model: SessionMember, include: [{ model: User, include: [Profile] }] },
          { model: Task }
        ]
      });
      res.json(sessions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const session = await StudySession.findByPk(req.params.id, {
        include: [
          { model: SessionMember, include: [{ model: User, include: [Profile] }] },
          { model: Task, include: [{ model: User, as: "assignedTo" }] }
        ]
      });
      if (!session) return res.status(404).json({ error: "Session not found" });
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export class TaskController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const { title, description, status, priority, deadline, sessionId, assignedToId } = req.body;
      const task = await Task.create({
        title,
        description,
        status,
        priority,
        deadline,
        sessionId,
        assignedToId
      });

      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.body;
      const task = await Task.findByPk(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });

      task.status = status;
      await task.save();

      if (status === "COMPLETED") {
        await GamificationService.addXP(task.assignedToId, 100, "completing a task");
      }

      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export class ProfileController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await Profile.findOne({
        where: { userId: req.user.id },
        include: [{ model: User, attributes: ["username", "email", "role"] }]
      });
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await Profile.findOne({ where: { userId: req.user.id } });
      if (!profile) return res.status(404).json({ error: "Profile not found" });

      await profile.update(req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await Profile.findAll({
        order: [["xp", "DESC"]],
        limit: 10,
        include: [{ model: User, attributes: ["username"] }]
      });
      res.json(leaderboard);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
