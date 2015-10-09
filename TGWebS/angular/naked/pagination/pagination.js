angular.module('nd.pagination', [])

.constant('paginationConfig', {
    pageSize: 10
})

.controller('ndPaginationCtrl', ['$scope', '$attrs', '$parse', '$animate', '$compile', 'paginationConfig', function ($scope, $attrs, $parse, $animate, $compile, paginationConfig) {
    var self = this,
      scope = $scope.$new(), // create a child scope so we are not polluting original one
      getIsOpen,
      setIsOpen = angular.noop;

    this.init = function (element) {
        self.$element = element;

        //控指令初始化，默认为1
        scope.pageIndex = 1;
        //每页大小，行数
        scope.pageSize = $attrs.pageSize ? Number.parseInt($attrs.pageSize) : paginationConfig.pageSize;
        //页面数量
        scope.pageCount = 0;

    };

    //分页变更
    scope.pageChangeX = function (index) {
        scope.pageIndex = index;
        self.query(scope);
    };

    //查询
    this.query = function () {
        //获取控制器的查询函数
        var ctrlQueryfn = $scope[$attrs.query];

        if ($attrs.query === undefined || $attrs.query === null || $attrs.query === "" || ctrlQueryfn === undefined) {
            return;
        }

        //执行控制器的查询函数
        ctrlQueryfn(scope.pageIndex, scope.pageSize, scope.queryFilter, function (totalCount) {
            //查询完成回调
            buildTable(scope.pageIndex, totalCount, scope.pageSize, scope);
        });
    };

    //创建table，并生成分页
    //pageIndex：当前页索引
    //totalCount：总记录数
    //pageSize：单页尺寸记录数
    //pScope：作用域
    function buildTable(pageIndex, totalCount, pageSize, pScope) {
        try {
            var pageCountArr = [];

            if (totalCount > pageSize) {
                //pageCount页面数量
                var pageCount = totalCount / pageSize;

                if (Math.round(pageCount) < pageCount) {
                    pageCount = Math.round(pageCount) + 1;
                }


                pScope.pageCount = pageCount;

                for (var i = 1; i <= pageCount; i++) {

                    if (i >= pageIndex - 3 && i <= pageIndex + 3) {
                        pageCountArr.push(i);
                    }
                }
            }
            else {

                pScope.pageCount = 1;

                pageCountArr.push(1);
            }
            //根据消息数量，计算显示页数，并设置当前索引
            pScope.pageCountArr = pageCountArr;
            //$scope.$apply();
            pScope.pageIndex = pageIndex;
        }
        catch (ex) {
            console.log(ex);
        }
    }

    var offDestroy = $scope.$on('$destroy', function () {
        scope.$destroy();
    });
    scope.$on('$destroy', offDestroy);
}])

.directive('ndPagination', function () {
    return {
        restrict: 'E',
        replace: true,
        controller: 'ndPaginationCtrl',
        templateUrl: 'template/pagination.html',
        link: function (scope, el, attrs, ctrl) {
            ctrl.init(el);

            //指令初始化，先执行查询
            //query(scope);
            ctrl.query();

            ////d
            //el.on("keydown", function () {
            //    //enter事件
            //    if (event.keyCode != 13) {
            //        return;
            //    }

            //    //验证输入
            //    if (scope.pageIndex < 1 || scope.pageIndex > scope.pageCount) {
            //        scope.pageIndex = 1;
            //    }

            //    //指令初始化，先执行查询
            //    //query(scope);
            //    ctrl.query();
            //});



        }
    };
});