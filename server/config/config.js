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
			doc: "jwt secret",
			format: String,
			default: null,
			env: "DEVCAMPER_JWT",
		},
		expire: {
			doc: "jwt expire time",
			format: String,
			default: "30d",
		},
	},
});

const env = _config.get("env");
_config.loadFile(`./config/${env}.json`);
_config.validate({ allowed: "strict" });

export const config = _config.getProperties();
