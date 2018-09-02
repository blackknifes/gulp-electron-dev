const appRoot = require("app-root-path").path;
const path = require("path");

const packageJson = require(path.resolve(appRoot, "package.json"));
if(!packageJson)
    throw gutil.PluginError("gulp-electron-dev", "not found " + path.resolve(appRoot, "package.json"));

module.exports = packageJson;