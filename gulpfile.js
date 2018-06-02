'use strict';

let gulp = require('gulp'),
    clean = require('gulp-clean'),
    cleanHtml = require('gulp-cleanhtml'),
    cleanJs = require('gulp-minify'),
    cleanJson = require('./json-minify'),
    cleanCSS = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    zip = require('gulp-zip');
const LIB_JS = ['src/js/vue.js', 'src/js/jquery.js', 'src/js/bootstrap.min.js'];
const src = {
    js: ['src/js/*.js'],
    json: ['src/*.json'],
    static: ['src/*.png', 'src/*/*.woff2',],
    static_js: LIB_JS,
    html: ['src/*.html'],
    css: ['src/css/**']
};
for (let lib of LIB_JS) {
    src.js.push('!' + lib);
}
//clean build directory
gulp.task('clean', function () {
    return gulp.src('build/*', {read: false})
        .pipe(clean());
});

//copy static file
gulp.task('copy', ['copy_js'], function () {
    return gulp.src(src.static)
        .pipe(gulp.dest('build'));
});
gulp.task('copy_js', function () {
    return gulp.src(src.static_js)
        .pipe(gulp.dest('build/js'));
});

//Html, Json, Js, Css
gulp.task('html', function () {
    return gulp.src(src.html)
        .pipe(cleanHtml())
        .pipe(gulp.dest('build'));
});
gulp.task('json', function () {
    return gulp.src(src.json)
        .pipe(cleanJson())
        .pipe(gulp.dest('build'));
});
let jsOpt = {
    ext: {
        min: '.js'
    },
    noSource: true
};
gulp.task('css', function () {
    return gulp.src(src.css)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('build/css'));
});
gulp.task('js', function () {
    return gulp.src(src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(cleanJs(jsOpt))
        .pipe(gulp.dest('build/js'));
});
gulp.task('lint', function () {
    return gulp.src(src.js);
});

//build distributable after other tasks completed
gulp.task('zip', ['html', 'js', 'json', 'css', 'copy'], function () {
    let manifest = require('./src/manifest'),
        distFileName = manifest.name + ' v' + manifest.version + '.zip';
    //build distributable extension
    return gulp.src(['build/**'])
        .pipe(zip(distFileName))
        .pipe(gulp.dest('dist'));
});

//build distributable after other tasks completed
gulp.task('debug', ['html', 'css', 'js']);

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean'], function () {
    gulp.start('zip');
});
