
////css
var fs = require('fs');
var CleanCSS = require('clean-css');

function cssMinifier(flieIn, fileOut) {
    var flieIn = Array.isArray(flieIn) ? flieIn : [flieIn];
    var origCode, finalCode = '';
    for (var i = 0; i < flieIn.length; i++) {
        origCode = fs.readFileSync(flieIn[i], 'utf8');
        //finalCode += CleanCSS.process(origCode);
        var minified = new CleanCSS().minify(origCode).styles
        finalCode += minified;
    }
    fs.writeFileSync(fileOut, finalCode, 'utf8');
}

//cssMinifier('./file-src/indexw_20120913.css', './file-smin/index.css');  //单个文件压缩
cssMinifier(['a.css', 'b.css'], '../un.css');



////new CleanCSS().minify(['a', 'b']);

//var CleanCSS = require('clean-css');
////var source = 'a{font-weight:bold;}';
//var minified = new CleanCSS({ target: 'un' }).minify(['a', 'b']).styles;
//console.log(minified);

