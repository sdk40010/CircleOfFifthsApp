const { src, dest, watch } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
sass.compiler = require('sass');
const plumber = require('gulp-plumber');
const webpack = require('webpack-stream');

const compilePug = (done) => {
  src([ 'pug/*.pug', '!pug/layout.pug'])
    .pipe(pug())
    .pipe(dest('.'));
  done();
}

const compileSaas = (done) => {
  src('sass/*.scss')
    .pipe(plumber())
    .pipe(
      sass({ 
        outputStyle: 'expanded',
        includePaths: ['node_modules']
      })
      .on('error', sass.logError))
    .pipe(dest('./css'));
  done();
}

const bundleJS = () => {
  src('src/entry.js')
    .pipe(webpack(require('./webpack.config')))
    .pipe(dest('.'));
}

exports.default = function () {
  watch([ 'pug/*.pug', '!pug/layout.pug'], compilePug);
  watch(['sass/*.scss'], compileSaas);
  bundleJS();
}