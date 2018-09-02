const watchify = require("watchify");

function buildOptions(options)
{
    if(!options)
        options = {};
    let opt;

    if(options.watch)
        opt = {...options, ...watchify.args};
    else
        opt = options;

    if(!opt.entries)
        return opt;

    if(opt.entries instanceof Array)
        opt.entries = opt.entries;
    else
        opt.entries = [opt.entries];

    return opt;
}

module.exports = buildOptions;