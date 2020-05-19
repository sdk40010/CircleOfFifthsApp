const { src, dest, watch } = require('gulp');
const pug = require('gulp-pug');
const webpack = require('webpack-stream');

const compilePug = (done) => {
  src([ 'pug/*.pug', '!pug/layout.pug'])
    .pipe(pug())
    .pipe(dest('.'));
  done();
}

const bundleJS = () => {
  src('app/entry.js')
    .pipe(webpack(require('./webpack.config')))
    .pipe(dest('.'));
}

exports.default = function () {
  watch([ 'pug/*.pug', '!pug/layout.pug'], compilePug);
  bundleJS();
}