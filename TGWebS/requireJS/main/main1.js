//require.config({
//    paths: {
//        a: 'a',
//        b: 'b',
//        c: 'c'
//    },
//    shim: {
//        a: {
//            exports: 'a'
//        },
//        b: {
//            deps: ['a']
//        },
//        c: {
//            deps: ['b']
//        }
//    },
//    waitSeconds: 0
//});
require(['a', 'b', 'c'],
function (a, b, c) {

});

