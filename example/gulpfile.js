const gulp = require('gulp')
//const clean = require('..').glob('build/*.js')
const clean = require('..')([])

gulp.task('sync', function () {
  return gulp.src('src/*.js')
    .pipe(gulp.dest('build'))
    .pipe(clean())
    .once('delete', files => console.log(files))
})

gulp.task('watch', ['sync'], function () {
  gulp.watch('src/*.js', ['sync'])
})

