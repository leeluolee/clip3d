var through = require('through2');
var shell = require("gulp-shell");
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var jshint = require('gulp-jshint');

var pkg = require("./package.json");  

var wpConfig = {
  output: {
    filename: "clip3d.js",
    library: "clip3d",
    libraryTarget: "umd"
  }
}



gulp.task('jshint', function(){
      // jshint
  gulp.src(['src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))

})


gulp.task('build', ['jshint'], function() {
  gulp.src("src/index.js")
    .pipe(webpack(wpConfig))
    .pipe(wrap(signatrue))
    .pipe(gulp.dest('./'))
    .on("error", function(err){
      throw err
    })
});




gulp.task( 'watch', ["build"], function(){
  gulp.watch(['src/**/*.js'], ['build']);
})


gulp.task( 'default', [ 'watch']);




function wrap(fn){
  return through.obj(fn);
}

function signatrue(file, enc, cb){
  var sign = '/**\n'+ '@author\t'+ pkg.author.name + '\n'+ '@version\t'+ pkg.version +
    '\n'+ '@homepage\t'+ pkg.homepage + '\n*/\n';
  file.contents =  Buffer.concat([new Buffer(sign), file.contents]);
  cb(null, file);
}