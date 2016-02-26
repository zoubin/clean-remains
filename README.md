# clean-remains
[![version](https://img.shields.io/npm/v/clean-remains.svg)](https://www.npmjs.org/package/clean-remains)
[![status](https://travis-ci.org/zoubin/clean-remains.svg)](https://travis-ci.org/zoubin/clean-remains)
![node](https://img.shields.io/node/v/clean-remains.svg)

Remove files created in the last run but not anymore in the current one.

In development environment, build process runs once a file change detected.
If a file is removed, the corresponding compiled file (like a browserify bundle) remains,
which is redundant and should be deleted.

## Example

The following example make the `'build'` directory always has the same contents with the `'src'` directory.

```javascript
const gulp = require('gulp')
const clean = require('clean-remains').glob('build/*.js')

gulp.task('sync', function () {
  return gulp.src('src/*.js')
    .pipe(gulp.dest('build'))
    .pipe(clean())
    .once('delete', files => console.log(files))
})

gulp.task('watch', ['sync'], function () {
  gulp.watch('src/*.js', ['sync'])
})

```

You could delete the whole `'build'` directory in the example above.
However, if you do that and there are also css files in the `'build'` directory,
they will be deleted against your will.

## API
```javascript
const Clean = require('clean-remains')

```

### clean = Clean(initialFiles)
Return a function like a gulp plugin,
which should be used after `gulp.dest`.

**initialFiles**

Type: `Array`

Required.

If there are no redundant files before the first run,
you could pass an empty array.

```javascript
const gulp = require('gulp')
const clean = require('clean-remains')([])

```

### clean = Clean.glob(patterns, opts)

`patterns` and `opts` are passed to [`globby`] to create the `initialFiles`.

