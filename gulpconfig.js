/**
 * Global Configuration for Gulp Tasks
 */
module.exports = {
  autoprefixer: {
    browsers: [
      'last 4 versions',
      'ie 9',
      'android 2.3',
      'android 4',
      'opera 12'
    ],
    cascade: false
  },
  browsersync: {
    options: {
      proxy: "NOTE: needs to be set via gulpconfig.local.js within the project",
      notify: false,
      open: 'local'
    }
  },
  clean: {
    path: [
      'cms/public/dist'
    ]
  },
  copy: {
    assets: {
      src: 'assets/**/*',
      dest: 'cms/public/dist/assets'
    }
  },
  css: {
    dest: 'cms/public/dist/css'
  },
  imagemin: {
    src: 'assets/images/**/*',
    options: {
      progressive: true,
      interlaced: true,
      svgoPlugins: [
        {removeUnknownsAndDefaults: false},
        {cleanupIDs: false}]
    },
    dest: 'cms/public/dist/images'
  },
  icons: {
    options: {
      id: 'icon-%f'
    },
    src: 'assets/icons/**/*.svg',
    dest: 'cms/public/dist/icons'
  },
  javascript: {
    all: 'components/**/*.js',
    src: 'components/*.js',
    dest: 'cms/public/dist/js'
  },
  jscs: {
    options: {
      configPath: 'node_modules/gulp-workflow/.jscsrc'
    }
  },
  modernizr: {
    settings: {
      'cache' : true,
      'options' : [
        'setClasses',
          'html5printshiv'
      ]
    }
  },
  preDom: {
    src: [
      'components/base/base-predom.js',
      'cms/public/dist/js/modernizr.js',
      'node_modules/picturefill/dist/picturefill.js',
      'node_modules/lazysizes/lazysizes.js'
    ],
    file: 'predom.js',
    dest: 'cms/public/dist/js'
  },
  sass: {
    options: {
      development: {
        outputStyle : 'nested',
          precision: 10,
          sourceMap: true
      },
      production: {
        outputStyle : 'compressed',
          precision: 10,
          sourceMap: false
      }
    },
    src: 'components/**/*.scss'
  },
  sasslint: {
    settings: {
      options: {
        ['config-file']: 'node_modules/gulp-workflow/.sass-lint.yml'
      }
    }
  },
  templates: {
    src: 'cms/craft/templates/**/*.twig'
  },
  webpack: {
    options: {
      module: {
        loaders: [
          { test: /\.js/, loader: 'imports-loader?define=>false'}
        ]
      },
      output: {
        filename: 'main.js',
      },
      resolve: {
        alias: {
          'CSSPlugin': 'gsap/src/uncompressed/plugins/CSSPlugin',
          'ScrollTo': 'gsap/src/uncompressed/plugins/ScrollToPlugin',
          'TweenLite': 'gsap/src/uncompressed/TweenLite',
          'TimelineLite': 'gsap/src/uncompressed/TimelineLite',
          'TweenMax': 'gsap/src/uncompressed/TweenMax',
          'TimelineMax': 'gsap/src/uncompressed/TimelineMax',
          'ScrollMagicGSAP': 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap'
        }
      }
    }
  }
}
