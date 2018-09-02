const through = require('through2');
const _browserify = require('browserify');
const pluginError = require("./pluginError");
const stream = require('./buffer2stream');

/**
 * @typedef FileOptions
 * @type { object }
 * @property { boolean } [entry]
 * @property { string } [expose]
 * @property { string } [basedir]
 * @property { string } [file]
 * @property { boolean } [external]
 * @property { boolean } [transform]
 * @property { string } [id]
 */

/**
 * @typedef InputFile
 * @type {string | NodeJS.ReadableStream | FileOptions}
 */

/**
 * @typedef Options
 * @type { object }
 * @property { InputFile } [entries]
 * @property { string[] } [noParse]
 * @property { string[] } [extensions]
 * @property { string[] } [paths]
 * @property { boolean } [commondir]
 * @property { boolean } [fullPaths]
 * @property { string[] | {[builtinName: string]: string} | boolean } [builtins]
 * @property { boolean } [bundleExternal]
 * @property { boolean } [insertGlobals]
 * @property { boolean } [detectGlobals]
 * @property { boolean } [debug]
 * @property { string } [standalone]
 * @property { string } [insertGlobalVars] { name: (file: string, basedir: string) => VariableConfig | string; }
 * @property { string } [externalRequireName]
 */

/**
 * browserify
 * @param {InputFile | FileOptions} fileOrOptions 
 * @param {Options} options 
 * @returns { any }
 */
function browserify(options)
{
    return new through.obj(function(file, enc, cb){
        if(file.isNull())
            return cb();
        if(file.isBuffer())
            file = file.pipe(stream());
        //vinly object to browserify object
        file = _browserify(file, options);
        cb(null, file);
    });
}

module.exports = browserify;