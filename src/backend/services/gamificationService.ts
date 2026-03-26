import { Profile, Notification } from "../models";

export class GamificationService {
  static async addXP(userId: number, amount: number, reason: string) {
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) return;

    profile.xp += amount;
    
    // Level up logic: Level = floor(sqrt(xp / 100)) + 1
    const newLevel = Math.floor(Math.sqrt(profile.xp / 100)) + 1;
    
    if (newLevel > profile.level) {
      profile.level = newLevel;
      await Notification.create({
        userId,
        title: "Level Up!",
        message: `Congratulations! You've reached Level ${newLevel} for ${reason}.`
      });
    }

    await profile.save();
    return profile;
  }
}
