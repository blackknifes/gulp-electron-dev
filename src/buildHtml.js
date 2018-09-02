const browserify = require('browserify');
const watchify = require("watchify");
const tsify = require("tsify");
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require("gulp-util");
const inlinesource = require("gulp-inline-source");
const path = require("path");
const uglifyify = require("uglifyify");
const vueify = require("vueify");
const electron = require("./electronServer");

const header = require("gulp-header");
const footer = require("gulp-footer");
var htmlmin = require('gulp-htmlmin');
var htmlmin = require('gulp-inject-string');

const package = require("./package");

//excludeModules
const excludeModules = [
    "fs",
    "electron",
    "path",
    "net"
];

let htmlMinOptions = {
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    removeComments: true,
    html5: true,
    collapseWhitespace: true
};

/**
 * @param { Object } [options] - build and browserify options
 * @param { Object } [options.env]
 * @param { string | string[] } [options.entries]
 * @param { Object } [options.replace]
 * @param { boolean } [options.watch]
 * @param { string } [options.header]
 * @param { string } [options.footer]
 * @param { boolean } [options.minify]
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
 * @return {Stream}
 */
function buildHtml(options)
{
    if(!options)
        options = { env:{} };
    if(options.env)
        options.env = {};

    let data = package;
    if(options.env)
        data = {...package, ...options.env};
    if(!options.entries)
        options.entries = "./src/renderer/index.html";

    if(!options.replace || options.replace instanceof Array)
        options.replace = {};

    let bundle = gulp.src(options.entries);
   
    if(options.watch)
    {
        bundle = bundle.plugin("watchify",  {
            delay: 100,
            poll: false
        });
    }

    //exclude fs and electron modules
    bundle
    .on("log", (message)=>{
        console.log(message);
    });

    //build chain
    let build = (cb)=>{
        bundle = bundle.bundle((err, src)=>{
            if(err)
                console.error(err);
        });

        if(options.replace)
        {
            for(let key in options.replace)
                bundle.pipe("<%" + key + "%>", options.replace[key]);
        }

        if(options.header)
            bundle = bundle.pipe(header(options.header, data));
        if(options.footer)
            bundle = bundle.pipe(footer(options.header, data));

        if(options.minify)
            bundle = bundle.pipe(htmlmin(htmlMinOptions));
    
        bundle = bundle.pipe(source("index.html"))
        .pipe(buffer())
        .pipe(gulp.dest('./dist/app').once("end", ()=>{
            console.log("build done.".green);
            if(cb)
                cb();
        }))
        .once("error", (err)=>{
            if(err)
                console.error("build error: " + err);
        })
        .once("end", ()=>{
            console.log("build done.".green);
            if(cb)
                cb();
        });
    };

    if(options.watch)
    {
        bundle.on("update", ()=>{
            build(()=>{
                electron.reload();
            });
        });
    }
    return build(()=>{
        bundle.reload();
    });
}

module.exports = buildHtml;