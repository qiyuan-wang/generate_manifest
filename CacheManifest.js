'use strict';

var fs = require('fs');
var wrench = require('wrench');
var path = require('path');

function CacheManifest(options) {
    var defaultCDNHost = ['http://s3.xiaohongshu.com', 'http://s4.xiaohognshu.com'];
    this.manifestPath = options.manifestPath || './xhsapp.manifest';

    if(process.env.CDN_HOST) {
        this.CDNs = process.env.CDN_HOST.replace(/\s/, '').split(',');
    } else {
        this.CDNs = defaultCDNHost;
    }

    this.basePath = options.basePath || process.cwd();
    this.files = options.files || [{
        dir: 'public',
        prefix: '/'
    }];

    this.filepathes = [];
}

CacheManifest.prototype.generateManifest = generateManifest;
CacheManifest.prototype.formatFilepathes = formatFilepathes;
CacheManifest.prototype.appendMTime = appendMTime;
CacheManifest.prototype.generateContent = generateContent;
CacheManifest.prototype.writeManifest = writeManifest;

function generateManifest() {
    this.formatFilepathes()
        .appendMTime()
        .generateContent()
        .writeManifest();
}

function formatFilepathes() {
    this.files.forEach(function(entry) {
        if(entry.file) {
            // file
            if(entry.prefix) {
                entry.path = entry.prefix + entry.file;
            }
            // deal with relative pathes
            if(!isAbsolute(entry.file)) {
                entry.file = path.join(this.basePath, entry.file);
            }
            this.filepathes.push({
                absolutePath: entry.file,
                exportPath: entry.path
            });

        } else if (entry.dir) {
            // directory
            if(!isAbsolute(entry.dir)) {
                entry.dir = path.join(this.basePath, entry.dir);
            }
            wrench.readdirSyncRecursive(entry.dir).forEach(function(filename) {
                var file = path.join(entry.dir, filename);
                if (fs.statSync(file).isFile()) {
                    this.filepathes.push({
                        absolutePath: file,
                        exportPath: entry.prefix + filename
                    });
                }
            }, this);
        }
    }, this);
    return this;
}

function appendMTime() {
    this.filepathes.forEach(function(filepath) {
        var mtime = fs.statSync(filepath.absolutePath).mtime.valueOf() / 1000;
        filepath.exportPath = [filepath.exportPath, "?s=", mtime].join('');
    });
    return this;
}

function generateContent() {
    this.generatedDate = new Date();
    var content = [];
    content.push('CACHE MANIFEST');
    content.push('# Generated at: ' + this.generatedDate);
    content.push('');
    content.push('CACHE:');
    this.filepathes.forEach(function(filepath){
        for(var i in this.CDNs) {
            content.push(this.CDNs[i] + filepath.exportPath);
        }
    }, this);
    content.push('');
    content.push('NETWORK:');
    content.push('*');
    content = content.join("\n");
    this.content = content;
    return this;
}

function writeManifest() {
    fs.writeFile(this.manifestPath, this.content, function(err){
        if(err) {
            return console.log(err);
        }
         console.log("CACHE MANIFEST generated successfully at " + this.generatedDate);
    }.bind(this));
}

var isAbsolute = path.isAbsolute || function(file) {
  return file.lastIndexOf(path.sep, 0) === 0; // only works for unix-like systems
};

module.exports = CacheManifest;
