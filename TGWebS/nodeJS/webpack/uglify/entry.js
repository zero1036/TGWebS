define("entry", function () {
    //变量 iabcdef 已引用，混淆
    var iabcdef = 11;
    //变量 $scope 已引用，但不混淆
    var $scope = "scope";

    document.write("entry module" + iabcdef);
    document.write($scope);

    //变量 ixzy 未被引用，剔除
    var ixzy = 3241;
});