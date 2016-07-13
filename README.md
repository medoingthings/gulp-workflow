# Documentation Front-End

## Getting Started
Make sure [Node](nodejs.org) is installed on your machine.

Then run `npm i`. It will install all the necessary dependencies.

Now run `gulp build:production` to build all the relevant assets.

## Gulp Tasks

The following gulp tasks are meant to be used for development and deployment:

`gulp build:development` (defaults to `gulp`) builds all the relevant assets and runs code style checks. No uglifying here.

`gulp build:production` is used by the deployment server to build all the assets in an optimized manner.

`gulp watch` runs `gulp` upfront and then starts to watch the source files to run the appropriate tasks, depending on what files were changed.

`gulp serve` identical to the watch task, but runs Browsersync, too. This automatically updates the browser when files change. `gulp serve --no-open` supresses the opening of a new browser window.

### Sass-Sourcemaps

Sourcemaps are deactivated by default (they increase build time). They can be activated with the `--sourcemaps` option. Examples:

```
$ gulp serve --sourcemaps
$ gulp serve --no-open --sourcemaps
$ gulp watch --sourcemaps
$ gulp sass:development --sourcemaps
```

### Modernizr

Modernizr is integrated in the build workflow. Depending on which Modernizr tests (Sass or JavaScript) are used, a custom `dist/js/modernizr.js` file is generated and integrated into `dist/js/predom.js`.

For example: If you added the selector `.no-touchevents {}` or `if (Modernizr.touchevents) {}` in Sass or JavaScript, running `gulp` searches through the project, finds those tests and adds the `touchevents` test to the `modernizr.js` or `predom.js` respectively.