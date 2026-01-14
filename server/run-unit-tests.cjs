const { execSync } = require("child_process");

try {
	execSync(
		"node --experimental-vm-modules node_modules/jest/bin/jest.js --no-coverage --forceExit --testTimeout=30000 --runInBand",
		{
			stdio: "inherit",
			cwd: process.cwd()
		}
	);
} catch (error) {
	process.exit(1);
}
