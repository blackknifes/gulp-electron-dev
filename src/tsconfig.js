const appRoot = require("app-root-path").path;
const path = require("path");

const tsConfig = require(path.resolve(appRoot, "tsconfig.json"));
if(!tsConfig)
    throw gutil.PluginError("gulp-electron-dev", "not found " + path.resolve(appRoot, "tsconfig.json"));

module.exports = tsConfig;