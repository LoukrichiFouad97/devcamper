import convict from "convict";
require("dotenv").config();

const _config = convict({
	env: {
		doc: "The application environment",
		format: ["prod", "dev", "test"],
		default: "dev",
		env: "NODE_ENV",
	},
	port: {
		doc: "port to bind",
		format: "port",
		default: 8080,
	},
	db: {
		url: {
			doc: "The application db url",
			format: String,
			default: "mongodb://localhost/devcamper",
		},
	},
	jwt: {
		secret: {
			doc: "json web token secret",
			format: String,
			default: null,
			env: "DEVCAMPER_JWT",
		},
		expire: {
			doc: "json web token expire time",
			format: String,
			default: "30d",
		},
		cookie_expire: {
			doc: "json web token cookie expire time",
			format: String,
			default: 30,
			env: "JWT_COOKIE_EXPIRE",
		},
	},
	photo: {
		max_size: {
			doc: "max photo size",
			format: "*",
			default: null,
			env: "MAX_UPLOAD_SIZE",
		},
		path: {
			doc: "folder to save uploaded photos",
			format: "*",
			default: null,
			env: "FILE_UPLOAD_PATH",
		},
	},
	email: {
		from_email: {
			doc: "the email sender email",
			format: "*",
			default: null,
			env: "FROM_EMAIL",
		},
		from_name: {
			doc: "the email sender name",
			format: "*",
			default: null,
			env: "FROM_NAME",
		},
		smtp: {
			host: {
				doc: "smtp host",
				format: "*",
				default: null,
				env: "SMTP_HOST",
			},
			port: {
				doc: "smtp port",
				format: "port",
				default: null,
				env: "SMTP_PORT",
			},
			email: {
				doc: "smtp user email",
				format: "*",
				default: null,
				env: "SMTP_EMAIL",
			},
			password: {
				doc: "smtp user password",
				format: "*",
				default: null,
				env: "SMTP_PASSWORD",
			},
		},
	},
});

const env = _config.get("env");
_config.loadFile(`./config/${env}.json`);
_config.validate({ allowed: "strict" });

export const config = _config.getProperties();
