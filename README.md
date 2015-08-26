#Generate Manifest

基于配置文件生成manifest文件。

## 参数 options
支持指定多文件夹及单个文件：

	options = {
    'manifestPath': //生成文件路径
    'basePath': //目标文件的basePath
    'timestamp': //是否基于生成时间戳更新缓存，默认值为false
    'files': [
        {
            'file': //文件相对路径,
            'prefix': //输出文件路径前缀
        },
        {
            'dir': //文件夹相对路径
            'prefix':  //输出文件路径前缀
        }
    ]
    
示例：

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
	
可参考__examples__文件夹下的__config.js__文件