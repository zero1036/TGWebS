define(['./common'], function (common) {
    var b = 20;
    return {
        add: function (val) {
            return val + val;
        },
        fn: function (val) {
            return val + 100 + common.cm;
        }
    };
});