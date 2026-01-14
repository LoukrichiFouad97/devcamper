import GitHubStrategy from "passport-github2";
import { User } from "../../models/user.model.js";
import { config } from "../config.js";

export const configureGitHubStrategy = (passport) => {
	passport.use(
		new GitHubStrategy.Strategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				callbackURL: process.env.GITHUB_CALLBACK_URL,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let email = profile.emails && profile.emails[0] ? profile.emails[0].value : profile.username + "@github.com";

					let user = await User.findOne({ email });

					if (user) {
						if (user.provider === "local") {
							user.provider = "github";
							user.providerId = profile.id;
							if (profile.photos[0]) {
								user.profilePhoto = profile.photos[0].value;
							}
							await user.save();
						}
						return done(null, user);
					}

					user = await User.create({
						name: profile.displayName || profile.username,
						email: email,
						provider: "github",
						providerId: profile.id,
						profilePhoto: profile.photos[0] ? profile.photos[0].value : profile.avatarUrl,
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
