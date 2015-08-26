var CacheManifest = require('../CacheManifest');
var config = require('./config');

var manifestGenerator = new CacheManifest(config);

manifestGenerator.generateManifest();
