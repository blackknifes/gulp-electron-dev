const PLUGIN_NAME = require("./package").name;
var PluginError = gutil.PluginError;

function pluginError(message)
{
    return PluginError(PLUGIN_NAME, message);
}

module.exports = pluginError;