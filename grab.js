var http = require('http')
  , https = require('https')
  , fs = require('fs')
  , dir = require('node-fs')
  , minimist = require('minimist')
  , jf = require('jsonfile');

var argv = require('minimist')(process.argv.slice(2));
var jsonPath = argv.har;
var parentPath = argv.path || "";
var resouceReg = /\.(jpg|woff|jpeg|gif|png|css|js|html|htm|asp|jsp|php|ogg|mp3|xml|wav|ogg|svg)/i;

if (!jsonPath) {
  console.log("you must pass the har file path by parameter with key 'har'");
  process.exit(1);
};

var jsonResult = jf.readFileSync(jsonPath);

if (!jsonResult) {
  console.log("loading har file failed");
  process.exit(1);
};

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var entries = jsonResult.log.entries;

entries.forEach(function(entry, index, array){
  var url = entry.request ? entry.request.url : null;

  if (url && resouceReg.test(url)) {
    try{
      var requestEndFunc = function(res){
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
          });
        });
      };

      var request;

      if (url.indexOf("https://") > -1) {
        request = https.get( url, requestEndFunc );
      }else{
        request = http.get( url, requestEndFunc );
      }

      request.setTimeout( 30000, function(){
        console.log( arguments );
        request.abort();
        console.log("timeout");
      });
    }catch(e){
      console.error( e.stack );
    }
  };
});