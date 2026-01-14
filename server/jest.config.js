{
	"testEnvironment": "node",
	"testMatch": ["**/test/**/*.test.js"],
	"collectCoverageFrom": [
		"controllers/**/*.js",
		"routes/**/*.js",
		"models/**/*.js",
		"middlewares/**/*.js"
	],
	"coveragePathIgnorePatterns": ["/node_modules/"],
	"extensionsToTreatAsEsm": [".js"],
	"transform": {},
	"nodeNotifier": false,
	"testTimeout": 30000
}
