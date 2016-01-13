define(['b'], function (b) {
    var i = 9;
    var fn = b.fn;
    var d1 = document.getElementById("d1");
    d1.innerHTML = fn(i);

});