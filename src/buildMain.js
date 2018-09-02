const browserify = require('browserify');
const watchify = require("watchify");
const tsify = require("tsify");
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const gutil = require("gulp-util");
const combiner = require('stream-combiner2');
const inlinesource = require("gulp-inline-source");
const buildOptions = require("./buildOptions");
const colors = require('./colors');
const path = require("path");
const uglifyify = require("uglifyify");
const electron = require("./electronServer");
const tsConfig = require("./tsconfig");
const through = require('through2');

//excludeModules
const excludeModules = [
    "fs",
    "electron",
    "path",
    "net"
];


/**
 * @param { Object } [options] - build and browserify options
 * @param { string | string[] } [options.entries=./src/main/index.js]
 * @param { boolean } [options.watch=false]
 * @param { boolean } [options.minify=false]
 * @param { boolean } [options.sourceMap=false]
 * 
 * @param { string[] } [options.noParse]
 * @param { string[] } [options.extensions]
 * @param { string[] } [options.paths]
 * @param { boolean } [options.commondir]
 * @param { boolean } [options.fullPaths]
 * @param { string[] | {[builtinName: string]: string} | boolean } [options.builtins]
 * @param { boolean } [options.bundleExternal]
 * @param { boolean } [options.insertGlobals]
 * @param { boolean } [options.detectGlobals]
 * @param { boolean } [options.debug]
 * @param { string } [options.standalone]
 * @param { insertGlobals.VarsOption } [options.insertGlobalVars]
 * @param { string } [options.externalRequireName]
 * @returns { Stream }
 */
function buildMain(options) {
    if (!options)
        options = {};
    //init options
    let opt = buildOptions(options);

    //init entries
    if (!opt.entries)
        opt.entries = "./src/main/index.ts";
    if (opt.entries instanceof Array) {
        for (let i = 0; i < opt.entries.length; ++i)
            opt.entries[i] = path.normalize(opt.entries[i]);
    }
    else
        opt.entries = path.normalize(opt.entries);

    if (opt.debug && typeof opt.entries == "string") {
        let ext = path.extname(opt.entries);
        let name = path.basename(opt.entries, ext);
        opt.entries = path.resolve(path.dirname(opt.entries), name + ".debug" + ext);
    }

    return through.obj((file, enc, callback) => {

        if(!file.isNull())
            return callback(null, file);

        if(file.isBuffer())
        {
            file.pipe();
        }
        
        //browserify construct
        let bundle = browserify(opt).plugin("tsify", tsConfig);

        //watchify
        if (options.watch) {
            bundle = bundle.plugin("watchify", {
                delay: 100,
                poll: false
            });
        }

        //minify
        if (options.minify)
            bundle = bundle.plugin("uglifyify", { sourceMap: options.sourceMap });

        //exclude fs and electron modules
        bundle = bundle.exclude(excludeModules)
            .on("log", (message) => {
                console.log(message);
            });

        //build chain
        let build = (cb) => {
            bundle.bundle((err, src) => {
                if (err)
                    console.error(err);
            })
                .pipe(source("main.js"))
                .pipe(buffer())
                .pipe(gulp.dest('./dist/app').once("end", () => {
                    console.log("build done.".green);
                    if (cb)
                        cb();
                }))
                .once("error", (err) => {
                    if (err)
                        console.error("build error: " + err);
                });
        };

        //restart
        if (options.watch) {
            bundle.on("update", () => {
                build(() => {
                    electron.restart();
                });
            });
        }

        //start
        return build(() => {
            electron.start();
        });
    });
}

module.exports = buildMain;