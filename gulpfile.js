'use strict';

let gulp = require('gulp'),
    clean = require('gulp-clean'),
    cleanHtml = require('gulp-cleanhtml'),
    cleanJs = require('gulp-minify'),
    cleanJson = require('./json-minify'),
    cleanCSS = require('gulp-clean-css'),
    zip = require('gulp-zip');

//clean build directory
gulp.task('clean', function () {
    return gulp.src('build/*', {read: false})
        .pipe(clean());
});

//copy static folders to build directory
gulp.task('copy', function () {
    gulp.src('src/fonts/**')
        .pipe(gulp.dest('build/fonts'));
    gulp.src(['src/*.png', 'src/LICENSE'])
        .pipe(gulp.dest('build'));
    return gulp.src('src/manifest.json')
        .pipe(cleanJson())
        .pipe(gulp.dest('build'));
});

//copy and compress HTML files
gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(cleanHtml())
        .pipe(gulp.dest('build'));
});

//copy and compress JS files
gulp.task('js', function () {
    gulp.src('src/js/*.js')
        .pipe(cleanJs({
            ext: {
                min: '.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('build/js'))
});
//minify styles
gulp.task('styles', function () {
    return gulp.src('src/css/**')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('build/css'));
});

//build distributable after other tasks completed
gulp.task('zip', ['html', 'js', 'styles', 'copy'], function () {
    let manifest = require('./src/manifest'),
        distFileName = manifest.name + ' v' + manifest.version + '.zip';
    //build distributable extension
    return gulp.src(['build/**'])
        .pipe(zip(distFileName))
        .pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean'], function () {
    gulp.run('zip');
});