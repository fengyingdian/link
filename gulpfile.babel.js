/*
 * File: gulpfiles.js
 * File Created: Tuesday, 18th December 2018 4:24:13 pm
 * Author: ChengCheng Wan (chengcheng.st@gmail.com)
 */

import del from 'del';
import log from 'fancy-log';
import doif from 'gulp-if';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import colors from 'ansi-colors';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify-es';
import jsonlint from 'gulp-jsonlint';
import cssnano from 'gulp-cssnano';
import jsonminify from 'gulp-jsonminify';
import replace from 'gulp-string-replace';
import htmlmin from 'gulp-htmlmin';
import gulp, { series, parallel } from 'gulp';

const wxSource = ['./src/app.js', './src/app.json', './src/app.wxss', './src/project.config.json'];

const jsSource = ['./src/**/*.js'];

const jsonSrouce = ['./src/**/*.json'];

const styleSrouce = ['./src/**/*.wxss', './src/**/*.scss', '!./src/styles/**'];

const assetSource = ['./src/assets/**'];

const viewSource = ['./src/**/*.wxml'];

const isProduction = process.env.NODE_ENV === 'production';

//
// ─── CLEAN ──────────────────────────────────────────────────────────────────────
//

export const clean = () => del(['./dist/**']);

//
// ─── LINT ───────────────────────────────────────────────────────────────────────
//
export const jsonLint = () => gulp
  .src(jsonSrouce)
  .pipe(jsonlint())
  .pipe(jsonlint.reporter())
  .pipe(jsonlint.failAfterError());

export const jsLint = () => gulp
  .src(jsSource)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());

//
// ─── BUILD ──────────────────────────────────────────────────────────────────────
//

export const jsBuild = () => gulp
  .src(jsSource)
  .pipe(doif(isProduction, replace(/\/dist\/pages\//g, '/pages/')))
  .pipe(
    babel({
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        [
          'minify-replace',
          {
            replacements: [
              {
                identifierName: 'Flimi',
                member: 'AppBase',
                replacement: {
                  type: 'identifier',
                  value: 'global.AppBase',
                },
              },
            ],
          },
        ],
      ],
    }).on('error', (err) => {
      log(colors.red('[Error]'), err.toString());
      log(colors.yellow('[Details]'), err);
      process.exit(1);
    }),
  )
  .pipe(doif(isProduction, uglify()).pipe(gulp.dest('./dist')));

export const jsonBuild = () => gulp
  .src(jsonSrouce)
  .pipe(doif(isProduction, jsonminify()))
  .pipe(gulp.dest('./dist'));

export const styleBuild = () => gulp
  .src(styleSrouce)
  .pipe(sass().on('error', sass.logError))
  .pipe(doif(isProduction, cssnano()))
  .pipe(
    rename((path) => {
      /* eslint no-param-reassign: 0 */
      path.extname = '.wxss';
    }),
  )
  .pipe(gulp.dest('./dist'));

export const viewBuild = () => gulp
  .src(viewSource)
  .pipe(doif(isProduction, replace(/\/dist\/pages\//g, '/pages/')))
  .pipe(
    doif(
      isProduction,
      htmlmin({
        caseSensitive: true,
        collapseWhitespace: true,
        removeComments: true,
        keepClosingSlash: true,
        ignoreCustomFragments: [/<wxs[\s\S]*?<\/wxs>/],
      }),
    ),
  )
  .pipe(gulp.dest('./dist'));

//
// ─── COPY ───────────────────────────────────────────────────────────────────────
//

export const copyAssets = () => gulp.src(assetSource).pipe(gulp.dest('./dist/assets'));

export const copyWXResource = () => gulp
  .src(wxSource)
  // .pipe(replace(/..\/dist\//g, './'))
  .pipe(gulp.dest('./dist'));

//
// ─── NPM SCRIPTS ────────────────────────────────────────────────────────────────
//
export const build = series(
  parallel(jsLint, jsonLint),
  clean,
  parallel(jsBuild, jsonBuild, styleBuild, viewBuild),
  parallel(copyAssets),
  parallel(copyWXResource),
);

export const watch = () => {
  // watch assets
  gulp.watch(assetSource, copyAssets);
  // watch json
  gulp.watch(jsonSrouce, jsonBuild);
  // watch styles
  gulp.watch(styleSrouce, styleBuild);
  // watch scripts
  gulp.watch(jsSource, jsBuild);
  // watch html(wxml)
  gulp.watch(viewSource, viewBuild);
  // watch wxsource
  gulp.watch(wxSource, copyWXResource);
};
