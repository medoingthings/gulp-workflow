////////////////////////////////////////////
// Copy this Gulpfile to the project you  //
// want to use the gulp-workflow with     //
////////////////////////////////////////////


/**
 * Generic Gulpfile that uses the configuration from node_modules/gulp-workflow
 */
'use strict';

var gulpconfigLocal;
var fs = require('fs');
var gulp = require('gulp');
var Gulpfile = require('./node_modules/gulp-workflow/gulpfile');

// Check if there is a local gulp configuration
try {
  fs.accessSync('./gulpconfig.local.js', fs.F_OK);
  gulpconfigLocal = require('./gulpconfig.local');
} catch (e) {
  console.warn('No gulpconfig.local.js found in this project.');
}

// Call external Gulpfile and pass the gulp instance and local configuration
Gulpfile(gulp, gulpconfigLocal);
