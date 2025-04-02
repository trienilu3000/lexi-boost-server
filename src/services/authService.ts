import { AppDataSource } from "../config/ormconfig";
import { Role } from "../entities/Role";
import { Users } from "../entities/User";
import { Profile } from "../entities/Profile";

export class AuthService {
  static async findOrCreateUser(profile: any) {
    const userRepository = AppDataSource.getRepository(Users);
    const roleRepository = AppDataSource.getRepository(Role);
    const profileRepository = AppDataSource.getRepository(Profile);

    let user = await userRepository.findOne({
      where: { email: profile.emails[0].value },
      relations: ["profile"],
    });

    if (!user) {
      let defaultRole = await roleRepository.findOne({
        where: { name: "user" },
      });
      if (!defaultRole) {
        defaultRole = roleRepository.create({ name: "user" });
        await roleRepository.save(defaultRole);
      }

      const newProfile = profileRepository.create({
        avatarUrl: profile.photos?.[0]?.value || null,
      });
      await profileRepository.save(newProfile);

      user = userRepository.create({
        fullName: profile.displayName,
        email: profile.emails[0].value,
        password: "",
        role: defaultRole,
        profile: newProfile,
      });

      await userRepository.save(user);
    } else {
      if (!user.profile) {
        const newProfile = profileRepository.create({
          avatarUrl: profile.photos?.[0]?.value || null,
          user: user,
        });
        await profileRepository.save(newProfile);
        user.profile = newProfile;
      } else {
        user.profile.avatarUrl =
          profile.photos?.[0]?.value || user.profile.avatarUrl;
        await profileRepository.save(user.profile);
      }

      await userRepository.save(user);
    }

    return user;
  }

  static async findUserById(userId: string) {
    const userRepository = AppDataSource.getRepository(Users);
    return userRepository.findOne({
      where: { userId },
      relations: ["role", "profile"],
    });
  }
}
