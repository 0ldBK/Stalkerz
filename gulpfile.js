var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    template = require('gulp-template'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    utf8 = require('utf8');

if(typeof argv.client == 'undefined'){
    argv.client = 'shurigina';
}

if(typeof argv.domain == 'undefined'){
    argv.domain = 'localhost';
}


/**
 * <%= panelDir %>
 * @type {{template: {version: string, panelDir: string, namespace: string, updateURL: string, downloadURL: string, client: (string|string)}}}
 */
var config = {
    group: 'basic',
    path: [],
    template: {
        version: '6.03.12',
        panelDir: 'http://' + argv.domain + '/service/bot_' + argv.client + '_master/',
        namespace: 'http://' + argv.domain,
        updateURL: 'https://' + argv.domain + '/service/bot_' + argv.client + '_master/js/install_js/master/loader.meta.js',
        downloadURL : 'https://' + argv.domain + '/service/bot_' + argv.client + '_master/js/install_js/master/loader.user.js',
        client: argv.client
    }
};

/**
 * core plugin
 */
gulp.task('core', function()
{
    return gulp.src(['develop/jFunc.js', 'develop/jStorage.js', 'develop/Core_panel.js'])
        .pipe(template(config.template))
        .pipe(gulpif(argv.production, uglify({
            output: {
                beautify: true,
                comments: false
            }
        })))
        .pipe(concat('Core_panel.js'))
        .pipe(gulp.dest('service/bot_' + argv.client + '_master'));

});

/**
 * loader user js
 */
gulp.task('userjs', function()
{
    return gulp.src(['develop/loader.*.js'])
        .pipe(template(config.template))
        .pipe(gulpif(argv.production, uglify({
            output: {
                beautify: false,
                comments: true
            }
        })))
        .pipe(gulp.dest('service/bot_' + argv.client + '_master/js/install_js/master/'));

});

/**
 * css
 */
gulp.task('css', function()
{
    return gulp.src(['develop/css/core.css', 'develop/css/frame.css', 'develop/css/rmap.css'])
        .pipe(gulp.dest('service/bot_' + argv.client + '_master/css/'));
});

/**
 * jstorage
 */
gulp.task('jstorage', function()
{
    return gulp.src(['develop/jStorage.js'])
        .pipe(gulp.dest('service/bot_' + argv.client + '_master/js/lib/'));
});

/**
 * img
 */
gulp.task('img', function()
{
    return gulp.src(['develop/img/*.*'])
        .pipe(gulp.dest('service/bot_' + argv.client + '_master/img/'));
});


/**
 * mp3
 */
gulp.task('mp3', function()
{
    return gulp.src(['develop/mp3/*.mp3'])
        .pipe(gulp.dest('service/bot_' + argv.client + '_master/mp3/'));
});

/**
 * php
 */
gulp.task('php', function()
{
    return gulp.src(
        [
            'develop/php/logs/',
            'develop/php/*.php'
        ]
    )
        .pipe(template(config.template))
        .pipe(gulp.dest('service/bot_' + argv.client + '_master/php/'));
});

/**
 * plugin
 */
gulp.task('plugin', function()
{
    return gulp.src('develop/js/plugin/*/*.js')
        .pipe(template(config.template))
        .pipe(gulp.dest('service/bot_' + argv.client + '_master/js/plugin/'));
});

/**
 * watch
 */
gulp.task('watch', ['core', 'jstorage', 'userjs', 'css', 'img', 'mp3', 'php', 'plugin'], function()
{
    // Отслеживаем файлы, и по их изменению, запускаем задачу
    gulp.watch('develop/Core_panel.js', ['core']);
    gulp.watch('develop/loader.*.js', ['userjs']);
    gulp.watch('develop/css/*.css', ['css']);
    gulp.watch('develop/php/!*.php', ['php']);
    gulp.watch('develop/js/plugin/*/*.js', ['plugin']);
});