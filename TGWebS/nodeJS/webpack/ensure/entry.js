require.ensure([], function (require) {
    console.log("entry");

    setTimeout(function () {
        var m1 = require("./m1");
        console.log(m1);
    }, 2000);


});
