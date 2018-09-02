const appRoot = require("app-root-path").path;
const path = require("path");

const distJson = require(path.resolve(appRoot, "dist.json"));
if(!distJson)
    throw gutil.PluginError("gulp-electron-dev", "not found " + path.resolve(appRoot, "dist.json"));

module.exports = distJson;