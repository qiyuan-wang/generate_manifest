var CacheManifest = require('../generate_manifest');
var basePath = './';

process.env.CDN_HOST = 'http://s3.xiaohongshu.com, http://s4.xiaohongshu.com';

var options = {
    'manifestPath': basePath + 'xhsapp.manifest',
    'basePath': basePath,
    'files': [
        {
            'file': 'public/release.js',
            'prefix': '/static/fls/'
        },
        {
            'dir': 'public/js',
            'prefix': '/static/fls/'
        },
        {
            'dir': 'data_static/js',
            'prefix': '/static/'
        }
    ],
};

var cache_manifest = new CacheManifest(options);

cache_manifest.init();
cache_manifest.generateManifest();

// var files = generate_manifest.retrieveFilesDirectories(options.files);
// generate_manifest.updatePathesWithMTime(files);

// generate_manifest.cache_manifest(options);
