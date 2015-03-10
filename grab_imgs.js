var http = require('http')
  , fs = require('fs')
  , dir = require('node-fs')
  , minimist = require('minimist')
  , jf = require('jsonfile');

var imgSrcs = [
"images/leopard/84.jpg",
"images/leopard/131.jpg",
"images/leopard/138.jpg",
"images/leopard/141.jpg",
"images/leopard/142.jpg",
"images/leopard/143.jpg",
"images/leopard/144.jpg",
"images/leopard/145.jpg",
"images/leopard/149.jpg",
"images/leopard/150.jpg",
"images/leopard/154.jpg",
"images/leopard/155.jpg",
"images/leopard/156.jpg",
"images/leopard/158.jpg",
"images/leopard/160.jpg",
"images/leopard/162.jpg",
"images/leopard/164.jpg",
"images/leopard/166.jpg",
"images/leopard/84.jpg",
"images/leopard/131.jpg",
"images/leopard/138.jpg",
"images/leopard/141.jpg",
"images/leopard/142.jpg",
"images/leopard/143.jpg",
"images/leopard/144.jpg",
"images/leopard/145.jpg",
"images/leopard/149.jpg",
"images/leopard/150.jpg",
"images/leopard/154.jpg",
"images/leopard/155.jpg",
"images/leopard/156.jpg",
"images/leopard/158.jpg",
"images/leopard/160.jpg",
"images/leopard/162.jpg",
"images/leopard/164.jpg",
"images/leopard/166.jpg"
];

for( var i = 0; i < imgSrcs.length; i++ ){
  (function( imgSrc ){
    var request = http.get('http://tiny.tonglingdi.cn/static/mazida/x15/' + imgSrc, function(res){
        var imagedata = '';
        res.setEncoding('binary');

        res.on('data', function(chunk){
            imagedata += chunk
        })

        res.on('end', function(){
            var dirPath = imgSrc.substring(0, imgSrc.lastIndexOf('/'));

            console.log( dirPath );
            dir.mkdirSync(dirPath, 0777, true)
            fs.writeFile(imgSrc, imagedata, 'binary', function(err){
                if (err) throw err
                console.log('File saved.')
            })
        })

    })
  })( imgSrcs[ i ]);
}