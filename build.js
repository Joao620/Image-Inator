var browserify = require('browserify');
var tsify = require('tsify');
var shim = require('browserify-shim')
var watchify = require('watchify');

if(process.argv[2] == 'build-browser'){
  browserify({
    basedir: './src',
  })
    .add('browser.ts')
    .plugin(tsify)
    .exclude('gpu.js')
    .transform(shim)
    .bundle()
    .pipe(process.stdout)
    .on('error', function (error) { console.error(error.toString()); })
}

else if(process.argv[2] == 'dev-browser'){
  browserify({
    basedir: './src',
  })
    .add('browser.ts')
    .plugin(tsify)
    .exclude('gpu.js')
    .transform(shim)
    .bundle()
    .pipe(process.stdout)
    .on('error', function (error) { console.error(error.toString()); })
}

else if(process.argv[2] == 'build-node'){

}
