var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var rename = require('gulp-rename');

function getEnvFile(argv) {
    var jsName = undefined;
    if (argv.indexOf('--online') != -1 || argv.indexOf('-o') != -1) {
        jsName = 'env-online.js'
    } else if (argv.indexOf('--test') != -1 || argv.indexOf('-t') != -1) {

        jsName = 'env-test.js'
    } else if (argv.indexOf('--dev') != -1 || argv.indexOf('-d') != -1) {

        jsName = 'env-dev.js'
    }
    return jsName
}

function build(jsName) {
    var envFile = path.join('.', 'env', jsName);

    if (!fs.existsSync(envFile)) {

        process.exit(1);
    }
    var destFile = path.join('config.js')
    if (fs.existsSync(destFile)) {
        fs.unlinkSync(destFile);
    }

    return gulp.src(envFile)
        .pipe(rename(function (path) {
            path.basename = 'config';
            path.extname = ".js";
        }))
        .pipe(gulp.dest(path.join('.', 'src')))
}

gulp.task('build', function () {
    var envFile = getEnvFile(process.argv);
    if (!envFile) {
        process.exit(1);
    }
    return build(envFile)
});