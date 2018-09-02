var through = require('through2');
const source = require('vinyl-source-stream');
const pluginError = require("./pluginError");
const buffer = require('./stream2buffer');
const stream = require('./buffer2stream');
const browserify = require('./gulpBrowserify');
const File = require('vinyl');
const appRoot = require("app-root-path").path;
const buildMain = require("./buildMain");
const typescript = require("typescript");
const path = require('path');
const rename = require('gulp-rename');
const copy = require('gulp-copy');
const fs = require('fs');

function concatArray(_array, extend)
{
    let arr;
    if(_array instanceof Array)
        arr = [..._array];
    else if(_array === null || _array === undefined)
        arr = [];
    else
        arr = [_array];
    if(extend instanceof Array)
        arr = arr.concat(extend);
    else if(extend === null || extend === undefined)
        return _array;
    else
        arr.push(extend);
    return _array;
}

class Electronify
{
    /**
     * @typedef TsCompilerOptions
     * @type {object}
     */

    /**
     * @typedef BuildOptions
     * @type { object }
     * @property {boolean} [debug=false]
     * @property {boolean} [minify=false]
     * @property {boolean} [sourceMap=false]
     * @property {boolean} [ts=false]
     * @property {TsCompilerOptions} [tsConfig]
     */

    /**
     * exclude all nodejs builtins modules
     * exclude electron modules
     * @property {string[]} excludeModules
     */
    static excludeModules = [
        ...require('module').builtinModules,
        'electron'
    ];

    /**
     * build electron main entry
     * @param {string} [entry=./src/main/index.js] 
     * @param {BuildOptions} [options] 
     * @returns {File}
     */
    mainify(entry, options)
    {
        options.excludeModules = concatArray(options.excludeModules, this.excludeModules);
    }

    /**
     * build electron renderer entry
     * @param {string} [entry=./src/renderer/index.js] 
     * @param {BuildOptions} [options] 
     * @returns {File}
     */
    rendererify(entry, options)
    {
        options.excludeModules = concatArray(options.excludeModules, this.excludeModules);
    }

    /**
     * build electron preload script
     * @param {string} [entry=./src/renderer/preload.js] 
     * @param {BuildOptions} [options] 
     * @returns {File}
     */
    preloadify(entry, options)
    {
        options.excludeModules = concatArray(options.excludeModules, this.excludeModules);
    }

    /**
     * build electron html entry
     * @param {string} [entry=./src/renderer/index.html] 
     * @param {BuildOptions} [options] 
     * @returns {File}
     */
    htmlify(entry, options)
    {
        options.excludeModules = concatArray(options.excludeModules, this.excludeModules);
    }

    /**
     * copy resource to dest
     * @param {object} options - res can be a string or { res: dest[, ...] }.
     * @returns {File}
     */
    copyify(options)
    {
        if(!(options instanceof object))
            options = {};
        for(let key in options)
            options[key] = path.resolve(appRoot, options[key]);
        return new through(function(file, enc, cb){
            let destPath = options[file.path];
            if(destPath)
            {
                if(path.extname(destPath) === "")
                    file.pipe(gulp.dest(destPath));
                else
                    file.pipe(rename(basename)).pipe(gulp.dest(path.dirname(destPath)));
                return cb();
            }
            return cb(null, file);
        });
    }

    /**
     * 
     * @param {object | string} name 
     * @param {any} options 
     * @returns {File}
     */
    plugin(name, options)
    {

    }

    //start electron
    start()
    {

    }

    //restart electron
    restart()
    {

    }

    //stop electron
    stop()
    {

    }

    //reload electron
    reload()
    {

    }

    //download electron
    download(options)
    {

    }

    //package electron
    package()
    {

    }
}

function buildMain() {
    return through.obj(function (file, enc, cb) {
        browserify()
        if (file.isNull()) {
            // 返回空文件
            return cb(null, file);
        }
        file.pipe(stream);
        
        return cb(null, file);
    });
}

function buildRenderer() {

}

function buildHtml() {

}