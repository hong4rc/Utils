'use strict';

const gulp = require('gulp'),
    clean = require('gulp-clean'),
    cleanHtml = require('gulp-cleanhtml'),
    cleanJs = require('gulp-minify'),
    cleanJson = require('./json-minify'),
    cleanCSS = require('gulp-clean-css'),
    lint = require('gulp-eslint'),
    zip = require('gulp-zip');

const LIB_JS = ['src/js/vue.js', 'src/js/jquery.js', 'src/js/bootstrap.min.js'];
const src = {
    js: ['src/js/*.js'],
    json: ['src/*.json'],
    static: ['src/*.png', 'src/*/*.woff2'],
    static_js: LIB_JS,
    html: ['src/*.html'],
    css: ['src/css/**']
};
for (const lib of LIB_JS) {
    src.js.push(`!${lib}`);
}

// clean build directory
gulp.task('clean', () => gulp.src('build/*', {read: false})
    .pipe(clean()));

// copy static file
gulp.task('copy', () => gulp.src(src.static)
    .pipe(gulp.dest('build')));
gulp.task('copy_js', () => gulp.src(src.static_js)
    .pipe(gulp.dest('build/js')));

// Html, Json, Js, Css
gulp.task('html', () => gulp.src(src.html)
    .pipe(cleanHtml())
    .pipe(gulp.dest('build')));
gulp.task('json', () => gulp.src(src.json)
    .pipe(cleanJson())
    .pipe(gulp.dest('build')));

gulp.task('css', () => gulp.src(src.css)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css')));

const jsOpt = {
    ext: {
        min: '.js'
    },
    noSource: true
};
gulp.task('js', () => gulp.src(src.js)
    .pipe(lint({fix: true}))
    .pipe(lint.format())
    .pipe(cleanJs(jsOpt))
    .pipe(gulp.dest('build/js')));

// build distributable after other tasks completed
const manifest = require('./src/manifest'),
    distFileName = `${manifest.name} v${manifest.version}.zip`;
gulp.task('zip', () => gulp.src(['build/**'])
    .pipe(zip(distFileName))
    .pipe(gulp.dest('dist')));

// run all tasks after build directory has been cleaned

gulp.task('file', gulp.parallel('html', 'js', 'json', 'css', 'copy', 'copy_js'));

// build distributable after other tasks completed
gulp.task('debug', gulp.series('file'));

gulp.task('default', gulp.series('clean', 'file', 'zip'));
