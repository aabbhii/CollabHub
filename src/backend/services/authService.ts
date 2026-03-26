import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, Profile } from "../models";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export class AuthService {
  static async register(userData: any) {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    await Profile.create({
      userId: user.id,
      name: username
    });

    return this.generateToken(user);
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid password");

    return this.generateToken(user);
  }

  static generateToken(user: User) {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
  }
}
