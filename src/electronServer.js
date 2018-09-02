const electronConnect = require('electron-connect');
const packager = require("electron-packager");
const builder = require("electron-builder");
const dist = require("./distribution");
const path = require("path");
const buildOptions = {
    arch: process.arch,
    dir: "./build",
    platform: "win32"
};

const electronOptions = {
    electronVersion: '2.0.8',
    platform: 'win32',
    arch: process.arch,
    download: {
        mirror: "https://npm.taobao.org/mirrors/electron"
    }
};

const electron = electronConnect.server.create({
    path: "./dist",
    stopOnClose: true,
    swpanOpt: {
        env:{
            NODE_ENV: "development"
        }
    }
});

electron.packager = function(options)
{
    if(!options.dir)
        options.dir = "./dist/";

    options.name = dist.name;
    if(!options.out)
        options.out = "./build";
    if(options.overwrite === null || options.overwrite === undefined)
        options.overwrite = true;
    if(!options.appVersion)
        options.appVersion = "1.0.0";

    return packager(src, options).then();
}

module.exports = electron;