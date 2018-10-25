"use strict";

module.exports = {
	watchDirs: ["./src"],
	js: [{
		source: "./src/index.js",
		target: "./dist/bundle.js",
		externals: {
			"popper.js": "Popper"
		}
	}]
};
