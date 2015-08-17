define('m2', ['./m1'], function (m1) {
    var v = m1.add(20);
    document.write(v);
});