const bufferstreams = require("bufferstreams");
const through = require('through2');
const pluginError = require("./pluginError");

function buffer2stream()
{
    return new through((file, enc, cb)=>{
        if(file.isNull())
            return cb();
        if(file.isStream())
            return cb(null, file);
        const _this = this;

        let contents = file.contents;
        file.contents = new bufferstreams(
            { objectMode: true }, 
            (err, buf, cb2)=>{
            if(err)
            {
                _this.emit("error", pluginError(err));
                return cb2(err, buf);
            }

            let ret = cb2(null, buf);
            return ret;
        });
        file.contents._write(contents, enc, ()=>{
            cb(null, file);
        });
    });
}