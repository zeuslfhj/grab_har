var http = require('http')
  , fs = require('fs')
  , dir = require('node-fs')
  , minimist = require('minimist')
  , jf = require('jsonfile');

var argv = require('minimist')(process.argv.slice(2));
var jsonPath = argv.har;
var parentPath = argv.path || "";
var resouceReg = /\.(jpg|gif|png|css|js|html|asp|jsp|php|ogg|mp3|xml)/i;

if (!jsonPath) {
  console.log("you must pass the har file path by parameter with key 'har'");
  process.exit(1);
};

var jsonResult = jf.readFileSync(jsonPath);

if (!jsonResult) {
  console.log("loading har file failed");
  process.exit(1);
};

var entries = jsonResult.log.entries;

entries.forEach(function(entry, index, array){
  var url = entry.request ? entry.request.url : null;

  if (url && resouceReg.test(url)) {
    var request = http.get( url, function(res){
      var resData = '';
        res.setEncoding('binary');

        res.on('data', function(chunk){
            resData += chunk
        });

        res.on("error", function( e ){
          console.log("load resource failed:" + e.message);
          console.error( e.stack );
        });

        res.on('end', function(){
          var lastInterrogation = url.lastIndexOf('?');
          var src = lastInterrogation > -1 ? url.substring(0, lastInterrogation) : url;
          var domain = src.substring(0, src.indexOf("/", src.indexOf("http://") + 8) + 1);
          var fileName = src.substr( src.lastIndexOf('/') );
          var dirPath = src.substring(0, src.lastIndexOf('/')).replace(domain, "");
          dirPath = parentPath + dirPath;

          console.log( "url:" + url + "; dirpath:" + dirPath );
          dir.mkdirSync(dirPath, 0777, true);
          fs.writeFile(dirPath + fileName, resData, 'binary', function(err){
              if (err){
                console.error(dirPath + fileName + " has error");
                throw err;
              } 
              console.log( dirPath + fileName + 'File saved.');
          })
        })
    });
  };
});

// for( var i = 0; i < imgSrcs.length; i++ ){
//   (function( imgSrc ){
//     var request = http.get('http://cny.levi.com.cn/' + imgSrc, function(res){
//         var imagedata = '';
//         res.setEncoding('binary');

//         res.on('data', function(chunk){
//             imagedata += chunk
//         })

//         res.on('end', function(){
//             var dirPath = imgSrc.substring(0, imgSrc.lastIndexOf('/'));

//             console.log( dirPath );
//             dir.mkdirSync(dirPath, 0777, true)
//             fs.writeFile(imgSrc, imagedata, 'binary', function(err){
//                 if (err) throw err
//                 console.log('File saved.')
//             })
//         })

//     })
//   })( imgSrcs[ i ]);
// }