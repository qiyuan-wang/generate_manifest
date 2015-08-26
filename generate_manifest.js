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
}


CacheManifest.prototype.init = init;
CacheManifest.prototype.formatFilepathes = formatFilepathes;
CacheManifest.prototype.updatePathesWithMTime = updatePathesWithMTime;
CacheManifest.prototype.updatePathesWithCDN = updatePathesWithCDN;
CacheManifest.prototype.generateManifest = generateManifest;

function init() {
    this.formatFilepathes();
    this.updatePathesWithMTime();
    this.updatePathesWithCDN();
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
            this.originFiles.push({
                file: entry.file,
                fullpath: entry.path
            });

        } else if (entry.dir) {
            // directory
            if(!isAbsolute(entry.dir)) {
                entry.dir = path.join(this.basePath, entry.dir);
            }
            wrench.readdirSyncRecursive(entry.dir).forEach(function(filename) {
                var file = path.join(entry.dir, filename);
                if (fs.statSync(file).isFile()) {
                    this.originFiles.push({
                        file: file,
                        fullpath: entry.prefix + filename
                    });
                }
            }, this);
        }
    }, this);
    return this;
}

function updatePathesWithMTime() {
    this.filepathes = [];
    this.originFiles.forEach(function(file) {
        this.filepathes.push(file.path + "?s=" + (fs.statSync(file.file).mtime.valueOf() / 1000));
    }, this);
    console.log(1, this.filepathes);
    return this;
}

function updatePathesWithCDN() {
    this.cdnizedFilepaths = [];
    this.CDNs.forEach(function(cdn){
        this.filepathes.forEach(function(filepath) {
            this.cdnizedFilepaths.push(path.join(cdn, filepath));
        }, this);
    }, this);
    return this;
}

function generateManifest() {
    this.generatedDate = new Date();
    var content = [];
    content.push('CACHE MANIFEST');
    content.push('# Generated at: ' + this.generatedDate);
    content.push('');
    content.push('CACHE:');
    this.cdnizedFilepaths.forEach(function(filepath){
        content.push(filepath);
    });
    content = content.join("\n");
    fs.writeFile(this.manifestPath, content, function(err){
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
