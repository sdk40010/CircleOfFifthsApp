const { src, dest } = require('gulp');
const pug = require('gulp-pug');

const compilePug = (done) => {
  src([ 'pug/**/*.pug', '!pug/**/layout.pug'])
    .pipe(pug())
    .pipe(dest('.'));
  done();
}

exports.default = compilePug