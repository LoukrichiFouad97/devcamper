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
});

const env = _config.get("env");
_config.loadFile(`./config/${env}.json`);
_config.validate({ allowed: "strict" });

export const config = _config.getProperties();
