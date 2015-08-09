define(['a'], function (a) {
    var i = a.i;
    return {
        fn: function (val) {
            return val + i;
        }
    };
});