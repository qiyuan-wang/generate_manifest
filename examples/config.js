var path = require('path');
var basePath = '../test';

var options = {
    'manifestPath': './xhsapp.manifest',
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

module.exports = options;
