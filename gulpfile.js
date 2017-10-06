'use strict';

module.exports = function (gulp, gulpconfigLocal) {

  // Get default configuration
  var gulpconfig = require('./gulpconfig');
  var jshintConfig  = require('./jshintrc.json');
  var extend = require('extend');

  // Merge the default configuration with the local one
  if (gulpconfigLocal && typeof gulpconfigLocal === 'object') {
    gulpconfig = extend(true, gulpconfig, gulpconfigLocal)
  }
  /**
  * Build Modules (ordered alphabetically)
  */
  var autoprefixer = require('gulp-autoprefixer');
  var browserSync = require('browser-sync');
  var del = require('del');
  var concat = require('gulp-concat');
  var imagemin = require('gulp-imagemin');
  var jscs = require('gulp-jscs');
  var jshint = require('gulp-jshint');
  var modernizr = require('gulp-modernizr');
  var newer = require('gulp-newer');
  var reload = browserSync.reload;
  var runSequence = require('run-sequence').use(gulp);
  var sass = require('gulp-sass');
  var sassLint = require('gulp-sass-lint');
  var svgSymbols = require('gulp-svg-symbols');
  var uglify = require('gulp-uglify');
  var webpack = require('webpack-stream');

  /**
  * All the Gulp tasks (ordered alphabetically)
  *
  * If you change things: please put all the configuration into gulpconfig.js.
  * This makes sure that things can be reused, support readability and
  * provide the possibility that they can be adjusted (only if necessary) in
  * the projects via the gulpconfig.local.js
  */

  // Clean up dist folders to remove outdated files
  gulp.task('clean:production', function () {
  return del(gulpconfig.clean.path);
  });

  // Copy assets to the dist folder
  gulp.task('copy:assets', function () {
  return gulp.src(gulpconfig.copy.assets.src)
    .pipe(gulp.dest(gulpconfig.copy.assets.dest));
  });

  // Output SVG sprite to reuse icons
  gulp.task('generate:svg-sprite', function () {
    return gulp.src(gulpconfig.icons.src)
      .pipe(svgSymbols(gulpconfig.icons.options))
      .pipe(gulp.dest(gulpconfig.icons.dest));
  });

  // Losslessly optimize only new images and move them to the dist folder
  gulp.task('imagemin:development', function () {
  return gulp.src(gulpconfig.imagemin.src)
    .pipe(newer(gulpconfig.imagemin.dest))
    .pipe(imagemin(gulpconfig.imagemin.options))
    .pipe(gulp.dest(gulpconfig.imagemin.dest));
  });

  // Losslessly optimize all images and move them to the dist folder
  gulp.task('imagemin:production', function () {
  return gulp.src(gulpconfig.imagemin.src)
    .pipe(imagemin(gulpconfig.imagemin.options))
    .pipe(gulp.dest(gulpconfig.imagemin.dest));
  });

  // JavaScript Code Style Checker
  gulp.task('jscs:development', () => {
  return gulp.src(gulpconfig.javascript.all)
    .pipe(jscs(gulpconfig.jscs.options))
    .pipe(jscs.reporter());
  });

  // Build JavaScript files with Webpack
  gulp.task('javascript:development', function () {
    return gulp.src(gulpconfig.javascript.src)
        .pipe(webpack(gulpconfig.webpack.options))
        .on('error', function (error) {
            console.log(error.message);
        })
        .pipe(gulp.dest(gulpconfig.javascript.dest));
  });

  gulp.task('javascript:production', function () {
    return gulp.src(gulpconfig.javascript.src)
        .pipe(webpack(gulpconfig.webpack.options))
        .pipe(uglify())
        .pipe(gulp.dest(gulpconfig.javascript.dest));
  });

  // Merge javascripts that need to run before the DOM is ready
  gulp.task('javascript-predom:development', ['modernizr'], function () {
  return gulp.src(gulpconfig.preDom.src)
    .pipe(concat(gulpconfig.preDom.file))
    .pipe(gulp.dest(gulpconfig.preDom.dest));
  });

  gulp.task('javascript-predom:production', ['modernizr'], function () {
  return gulp.src(gulpconfig.preDom.src)
    .pipe(uglify())
    .pipe(concat(gulpconfig.preDom.file))
    .pipe(gulp.dest(gulpconfig.preDom.dest));
  });

  // Create a task that ensures the `js` task is complete before
  // reloading browsers via BrowserSync
  gulp.task('javascript-watch', ['javascript:development'], browserSync.reload);

  // Enforce JavaScript code style and prevent errors
  gulp.task('jshint:development', function() {
  return gulp.src(gulpconfig.javascript.all)
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter('jshint-stylish'));
  });

  // Make a Custom Build of Modernizr
  var modernizrFiles = [];
  modernizrFiles = modernizrFiles.concat(gulpconfig.javascript.all, gulpconfig.sass.src);

  // The output will be concatenated by the `javascript-predom` task
  gulp.task('modernizr', function () {
  return gulp.src(modernizrFiles)
    .pipe(modernizr(gulpconfig.modernizr.settings))
    .pipe(gulp.dest(gulpconfig.javascript.dest));
  });

  // Compile Sass
  gulp.task('sass:development', function () {
  return gulp.src(gulpconfig.sass.src)
    .pipe(sass(gulpconfig.sass.options.development).on('error', sass.logError))
    .pipe(autoprefixer(gulpconfig.autoprefixer))
    .pipe(gulp.dest(gulpconfig.css.dest))
    .pipe(browserSync.stream());
  });

  gulp.task('sass:production', function () {
  return gulp.src(gulpconfig.sass.src)
    .pipe(sass(gulpconfig.sass.options.production))
    .pipe(autoprefixer(gulpconfig.autoprefixer))
    .pipe(gulp.dest(gulpconfig.css.dest));
  });

  // Code style check for Sass
  gulp.task('sasslint:development', function () {
  return gulp.src(gulpconfig.sass.src)
    .pipe(sassLint(gulpconfig.sasslint.settings))
    .pipe(sassLint.format());
  });

  /**
  * Build Tasks for development and production
  */
  gulp.task('default', ['build:development']);

  // Static Server + watching scss/html files
  gulp.task('serve', ['build:development'], function() {

    // Don’t open the browser window automatically, if --no-open argument is passed
    if (process.argv.indexOf('--no-open') !== -1) {
      gulpconfig.browsersync.options.open = false;
    }

    browserSync.init(gulpconfig.browsersync.options);

    gulp.watch(gulpconfig.icons.src, ['generate:svg-sprite']);
    gulp.watch(gulpconfig.sass.src, ['sass:development', 'sasslint:development']);
    gulp.watch(gulpconfig.imagemin.src, ['imagemin:development']);
    gulp.watch(gulpconfig.javascript.all, ['javascript-watch', 'jshint:development', 'jscs:development']);
    gulp.watch(gulpconfig.templates.src).on('change', browserSync.reload);
  });

  // Watching Sass and JavaScript files
  gulp.task('watch', ['build:development'], function() {
    gulp.watch(gulpconfig.icons.src, ['generate:svg-sprite']);
    gulp.watch(gulpconfig.sass.src, ['sass:development', 'sasslint:development']);
    gulp.watch(gulpconfig.javascript.all, ['javascript-watch', 'jshint:development', 'jscs:development']);
    gulp.watch(gulpconfig.imagemin.src, ['imagemin:development']);
  });

  // Build files for development (uncompressed)
  gulp.task('build:development', [
  'copy:assets',
  'generate:svg-sprite',
  'imagemin:development',
  'javascript:development',
  'javascript-predom:development',
  'jscs:development',
  'jshint:development',
  'sass:development',
  'sasslint:development'
  ]);

  // Build files for production (compression, fail on errors)
  gulp.task('build:production', function (callback) {
  runSequence('clean:production', [
    'copy:assets',
    'generate:svg-sprite',
    'imagemin:production',
    'javascript:production',
    'javascript-predom:production',
    'sass:production'
  ], callback);
  });
};
