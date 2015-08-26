'use strict';

var assert = require('assert');
var CacheManifest = require('../CacheManifest');
var path = require('path');
var fs = require('fs');

var basePath = process.cwd().indexOf('/test') === -1 ? './test': '.';


describe('CacheManifest', function() {

    describe('CacheManifest:formatFilepathes', function() {
        it('should format single file into filepathes', function() {
            var options = {
                'basePath': basePath,
                files: [
                    {
                        'file': '/public/release.js',
                        'prefix': '/static/fls/'
                    }
                ]
            };

            var manifestGenerator = new CacheManifest(options);
            manifestGenerator.formatFilepathes();

            assert.equal(manifestGenerator.filepathes.length, 1);
            assert.ok(manifestGenerator.filepathes[0].exportPath.indexOf('/static/fls/') === 0);
        });

        it('should format directory into filepathes', function() {
            var options = {
                'basePath': basePath,
                files: [
                    {
                        'dir': 'public/js',
                        'prefix': '/static/fls/'
                    }
                ]
            };

            var manifestGenerator = new CacheManifest(options);
            manifestGenerator.formatFilepathes();

            assert.equal(manifestGenerator.filepathes.length, 3);
            assert.ok(manifestGenerator.filepathes[2].exportPath.indexOf('foo.js') > 0);
        });
    });

    describe('CacheManifest:appendMTime', function() {
        var manifestGenerator;

        beforeEach(function() {
            var options = {
                'basePath': basePath,
                files: [
                    {
                        'file': 'public/release.js',
                        'prefix': '/static/fls/'
                    }
                ]
            };

            var isAbsolute = path.isAbsolute || function(file) {
              return file.lastIndexOf(path.sep, 0) === 0; // only works for unix-like systems
            };

            manifestGenerator = new CacheManifest(options);
            manifestGenerator.formatFilepathes().appendMTime();
        });

        it('should read file\'s mtime and append it to exportPath', function() {
            assert.ok(manifestGenerator.filepathes[0].exportPath.match(/\?s=\d{10,}/));
        });

        it('and they have same value', function() {
            var mtime = fs.statSync(path.join(process.cwd(), 'public/release.js')).mtime.valueOf() / 1000;
            assert.equal(manifestGenerator.filepathes[0].exportPath.match(/\?s=(\d{10,})/)[1], mtime + '');
        });
    });

    describe('CacheManifest:generateContent', function() {
        var manifestGenerator;

        beforeEach(function() {
            var options = {
                'basePath': basePath,
                files: [
                    {
                        'file': 'public/release.js',
                        'prefix': '/static/fls/'
                    }
                ]
            };

            var isAbsolute = path.isAbsolute || function(file) {
              return file.lastIndexOf(path.sep, 0) === 0; // only works for unix-like systems
            };

            manifestGenerator = new CacheManifest(options);
            manifestGenerator.formatFilepathes().appendMTime().generateContent();
        });

        it('should have content for file release', function() {
            assert.ok(manifestGenerator.content.match(/release.js/));
        });
    });
});
