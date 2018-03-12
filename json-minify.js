const through = require('through2');
function jsonMinify(str){
    return JSON.stringify(JSON.parse(str), null, 0);
}

module.exports = () => through.obj((file, enc, cb) => {
    if (file.isNull()) {
        return cb(null, file);
    }
    if (file.isBuffer()) {
        file.contents = new Buffer(jsonMinify(file.contents.toString()));
        cb(null, file);
    } else{
        throw new Error('This is not Buffer');
    }
});


