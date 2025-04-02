import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { AuthService } from "../services/authService";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await AuthService.findOrCreateUser(profile);
                return done(null, user.userId); // Serialize userId thay vì user object
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// Serialize user bằng userId để lưu vào session
passport.serializeUser((userId, done) => done(null, userId));

// Deserialize user từ userId
passport.deserializeUser(async (userId: string, done) => {
    try {
        const user = await AuthService.findUserById(userId);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
