const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const bourbon = require('node-bourbon');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const cache = require('gulp-cache');
const ghPages = require('gh-pages');

// browserSync rules
function browsersync() {
  browserSync.init({
    server: { baseDir: 'dist/' }, // Changed to 'dist/' to match the build destination
    notify: true,
    online: true
  });
}

// expanded CSS compilation
function styles() {
  return src('app/sass/**/*.sass')
    .pipe(sass({
      includePaths: bourbon.includePaths,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: [
        'last 15 versions',
        'ie >= 7',
        'Firefox < 20'
      ],
      grid: true
    }))
    .pipe(dest('app/css/'))
    .pipe(browserSync.reload({ stream: true }));
}

// minified CSS compilation to source-files folder
function cssmin() {
  return src('app/sass/**/*.sass')
    .pipe(sass({ includePaths: bourbon.includePaths }))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(autoprefixer({
      overrideBrowserslist: [
        'last 15 versions',
        'ie >= 7',
        'Firefox < 20'
      ],
      grid: true
    }))
    .pipe(cleanCSS())
    .pipe(dest('dist/source-files/braxton-css-min-files/'));
}

// expanded CSS compilation to source-files folder
function cssexp() {
  return src('app/sass/**/*.sass')
    .pipe(sass({
      includePaths: bourbon.includePaths,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: [
        'last 15 versions',
        'ie >= 7',
        'Firefox < 20'
      ],
      grid: true
    }))
    .pipe(dest('dist/source-files/braxton-css-files/'));
}

// HTML build
function html() {
  return src('app/*.html')
    .pipe(dest('dist/'));
}

// JS libs for template minification
function libs() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'assets/modernizr/modernizr.js',
    'node_modules/gsap/dist/gsap.js',
    'node_modules/gsap/dist/ScrollTrigger.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
    'node_modules/@studio-freight/lenis/dist/lenis.js',
    'node_modules/imagesloaded/imagesloaded.pkgd.js',
    'node_modules/swiper/swiper-bundle.js',
    'node_modules/particles.js/particles.js',
    'node_modules/photoswipe/dist/photoswipe.js',
    'node_modules/photoswipe/dist/photoswipe-ui-default.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify().on('error', console.error))
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream());
}

// expanded JS libs compilation to source-files folder
function libsexp() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'assets/modernizr/modernizr.js',
    'node_modules/gsap/dist/gsap.js',
    'node_modules/gsap/dist/ScrollTrigger.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
    'node_modules/@studio-freight/lenis/dist/lenis.js',
    'node_modules/imagesloaded/imagesloaded.pkgd.js',
    'node_modules/swiper/swiper-bundle.js',
    'node_modules/particles.js/particles.js',
    'node_modules/photoswipe/dist/photoswipe.js',
    'node_modules/photoswipe/dist/photoswipe-ui-default.js'
  ])
    .pipe(concat('libs.js'))
    .pipe(dest('dist/source-files/braxton-js-files/'));
}

// clean dist folder
function cleandist() {
  return del(['dist/**']);
}

// files copy to dist, including fonts/icons
function buildcopy() {
  return src([
    'app/css/**/*.css',
    'app/*.html',
    'app/js/**/*.js',
    'app/fonts/**/*',    // Make sure your icon files (fonts/icons) are included here
    'app/video/**/*',
    'app/img/**/*',      // Ensure images (including icons) are copied
    'app/.htaccess',
    'app/mail.php',
    'app/pdf/**/*',
  ], { base: 'app' })
    .pipe(dest('dist'));
}

// app.js copy to dist
function buildalljs() {
  return src([
    'app/js/demo/demo.js',
    'app/js/app.js',
    'app/js/gallery-init.js',
    'app/js/maps/*.js'
  ])
    .pipe(dest('dist/source-files/braxton-js-files/'));
}

// watch for file changes
function startwatch() {
  watch('app/**/*.html').on('change', browserSync.reload);
  watch(['app/**/*.js', '!app/**/*.min.js'], libs);
  watch(['app/sass/**/*.sass'], styles);
}

// clear cache
function clearcache() {
  return cache.clearAll();
}

// Deploy to GitHub Pages
function deploy(cb) {
  ghPages.publish('dist', {
    branch: 'gh-pages',
    repo: 'https://github.com/mmuneesm99/munees.co.in.git'
  }, cb);
}

// all functions export
exports.browsersync = browsersync;
exports.libs = libs;
exports.libsexp = libsexp;
exports.styles = styles;
exports.cssmin = cssmin;
exports.cssexp = cssexp;
exports.html = html;
exports.clearcache = clearcache;
exports.deploy = deploy;
exports.build = series(cleandist, styles, cssmin, cssexp, html, libs, libsexp, buildcopy, buildalljs);
exports.default = parallel(styles, libs, browsersync, startwatch);
