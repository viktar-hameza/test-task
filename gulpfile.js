var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    changed = require('gulp-changed'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    cleanCSS    = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    del = require('del'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    runSequence = require('run-sequence'),
    wiredep = require('gulp-wiredep'),
    gulpIgnore = require('gulp-ignore'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    path = require('path');

gulp.task('svgstore', function () {
  return gulp
    .src('test/src/*.svg')
    .pipe(svgmin(function (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      }
    }))
    .pipe(svgstore())
    .pipe(gulp.dest('test/dest'));
});

// Start browserSync server
gulp.task('browser-sync', function() {
  browserSync({
      server: {
        baseDir: 'app',
      },
      port: 3000,
      open: true,
      notify: false
  });
});

// Preprocessor Sass
gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass({
        includePaths: require('node-bourbon').includePaths
    }).on('error', sass.logError))
    .pipe(autoprefixer(['last 3 versions']))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

// Preprocessor Jade
/*gulp.task('jade', function() {
  return gulp.src('app/jade/*.jade')
    .pipe(changed('app', {extension: '.html'}))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream: true}))
});*/

// Bower wiredep
gulp.task('bower', function () {
  gulp.src('app/*.html')
    .pipe(wiredep({
      optional: 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images
gulp.task('img', function() {
  return gulp.src(['app/img/**/*', '!app/img/imgorigin/**'])
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'))
});

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist');
});
gulp.task('cleanimg', function() {
  return del.sync('dist/img/imgorigin');
});
gulp.task('clear', function() {
  return cache.clearAll();
});

// Watchers
gulp.task('watch', ['sass', 'browser-sync', 'bower'], function() {
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  // gulp.watch('app/jade/**/*.jade', ['jade']);
  // gulp.watch('app/*.html', ['bower']);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  gulp.watch('bower.json', ['bower']);
});

// Build

gulp.task('default', ['watch']);

gulp.task('build', function(callback) {
  runSequence(
    'clean',
    ['sass', 'bower', 'useref', 'fonts', 'img'], 'cleanimg',
    callback
  )
});