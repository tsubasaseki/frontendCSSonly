'use strict'

import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import minifyCss from 'gulp-minify-css';
import browserSync from 'browser-sync';

import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssDeclarationSorter from 'css-declaration-sorter';
import rename from 'gulp-rename';

const rootDir = `./public`
const srcDir = `./src`
const mapDir = './maps'
const path = {
    all: `${rootDir}/*`,
    html: `${rootDir}/**/*.html`,
    styles: {
        src: `${srcDir}/scss/**/*.scss`,
        dest: `${rootDir}/assets/css`
    }
};

const style = () => {
    const plugin = [
        autoprefixer({
            browsers: [
                'last 2 versions'
            ]
        }),
        cssDeclarationSorter({
            order: 'smacss'
        })
    ];

    return gulp.src(path.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'})) // DON'T use sass option {outputStyle: 'compressed'} the reason is that the map is slip
        .pipe(gulp.dest(path.styles.dest))
        .pipe(postcss(plugin))
        .pipe(rename({extname:'.pre.css'}))

        .pipe(gulp.dest(path.styles.dest))
        .pipe(rename(function (path) {
            path.basename = path.basename.replace(/\.pre$/, '');
        }))
        .pipe(minifyCss({advanced:false}))
        .pipe(sourcemaps.write(mapDir))
        .pipe(rename({extname:'.min.css'}))
        .pipe(gulp.dest(path.styles.dest))
}

const server = browserSync.create();
const reload = (done) => {
    server.reload();
    done();
};
const serve = (done) => {
    server.init({
        server: {
            baseDir: rootDir
        }
    });
    done();
};

const watch = () => {
    gulp.watch(path.styles.src, style)
    gulp.watch([
        path.html,
        path.styles.dest + '/*.css',
    ], reload)
};

export default gulp.series(serve, watch);