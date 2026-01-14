import GoogleStrategy from "passport-google-oauth20";
import { User } from "../../models/user.model.js";
import { config } from "../config.js";

export const configureGoogleStrategy = (passport) => {
	passport.use(
		new GoogleStrategy.Strategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: process.env.GOOGLE_CALLBACK_URL,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await User.findOne({ email: profile.emails[0].value });

					if (user) {
						if (user.provider === "local") {
							user.provider = "google";
							user.providerId = profile.id;
							if (profile.photos[0]) {
								user.profilePhoto = profile.photos[0].value;
							}
							await user.save();
						}
						return done(null, user);
					}

					user = await User.create({
						name: profile.displayName,
						email: profile.emails[0].value,
						provider: "google",
						providerId: profile.id,
						profilePhoto: profile.photos[0] ? profile.photos[0].value : null,
						password: Math.random().toString(36).slice(-16),
						isEmailConfirmed: true,
					});

					return done(null, user);
				} catch (error) {
					return done(error, null);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (error) {
			done(error, null);
		}
	});
};
