/*
 * angular-ui-nd
 */
angular.module("ui.nd", ["ui.bootstrap.pagination", "nd.wall"]);
angular.module('ui.bootstrap.pagination', [])
.controller('UibPaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
    var self = this,
        ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
        setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

    this.init = function (ngModelCtrl_, config) {
        ngModelCtrl = ngModelCtrl_;
        this.config = config;

        ngModelCtrl.$render = function () {
            self.render();
        };

        if ($attrs.itemsPerPage) {
            $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
                self.itemsPerPage = parseInt(value, 10);
                $scope.totalPages = self.calculateTotalPages();
            });
        } else {
            this.itemsPerPage = config.itemsPerPage;
        }

        $scope.$watch('totalItems', function () {
            $scope.totalPages = self.calculateTotalPages();
        });

        $scope.$watch('totalPages', function (value) {
            setNumPages($scope.$parent, value); // Readonly variable

            if ($scope.page > value) {
                $scope.selectPage(value);
            } else {
                ngModelCtrl.$render();
            }
        });
    };

    this.calculateTotalPages = function () {
        var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
        return Math.max(totalPages || 0, 1);
    };

    this.render = function () {
        $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
    };

    $scope.selectPage = function (page, evt) {
        if (evt) {
            evt.preventDefault();
        }

        var clickAllowed = !$scope.ngDisabled || !evt;
        if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
            if (evt && evt.target) {
                evt.target.blur();
            }
            ngModelCtrl.$setViewValue(page);
            ngModelCtrl.$render();
        }
    };

    $scope.getText = function (key) {
        return $scope[key + 'Text'] || self.config[key + 'Text'];
    };

    $scope.noPrevious = function () {
        return $scope.page === 1;
    };

    $scope.noNext = function () {
        return $scope.page === $scope.totalPages;
    };
}])

.constant('uibPaginationConfig', {
    itemsPerPage: 10,
    boundaryLinks: false,
    directionLinks: true,
    firstText: 'First',
    previousText: 'Previous',
    nextText: 'Next',
    lastText: 'Last',
    rotate: true
})

.directive('uibPagination', ['$parse', 'uibPaginationConfig', function ($parse, paginationConfig) {
    return {
        restrict: 'EA',
        scope: {
            totalItems: '=',
            firstText: '@',
            previousText: '@',
            nextText: '@',
            lastText: '@',
            ngDisabled: '='
        },
        require: ['uibPagination', '?ngModel'],
        controller: 'UibPaginationController',
        controllerAs: 'pagination',
        //templateUrl: function (element, attrs) {
        //    return attrs.templateUrl || 'template/pagination/pagination.html';
        //},
        template: '<ul class="pagination"><li ng-if="::boundaryLinks"ng-class="{disabled: noPrevious()||ngDisabled}"class="pagination-first"><a href ng-click="selectPage(1, $event)">&laquo;</a></li><li ng-if="::directionLinks"ng-class="{disabled: noPrevious()||ngDisabled}"class="pagination-prev"><a href ng-click="selectPage(page - 1, $event)">previous</a></li><li ng-repeat="page in pages track by $index"ng-class="{active: page.active,disabled: ngDisabled&&!page.active}"class="pagination-page"><a href ng-click="selectPage(page.number, $event)">{{page.text}}</a></li><li ng-if="::directionLinks"ng-class="{disabled: noNext()||ngDisabled}"class="pagination-next"><a href ng-click="selectPage(page + 1, $event)">next</a></li><li ng-if="::boundaryLinks"ng-class="{disabled: noNext()||ngDisabled}"class="pagination-last"><a href ng-click="selectPage(totalPages, $event)">&raquo;</a></li><li></ul>',
        replace: true,
        link: function (scope, element, attrs, ctrls) {
            var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

            if (!ngModelCtrl) {
                return; // do nothing if no ng-model
            }

            // Setup configuration parameters
            var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
                rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

            paginationCtrl.init(ngModelCtrl, paginationConfig);

            if (attrs.maxSize) {
                scope.$parent.$watch($parse(attrs.maxSize), function (value) {
                    maxSize = parseInt(value, 10);
                    paginationCtrl.render();
                });
            }

            // Create page object used in template
            function makePage(number, text, isActive) {
                return {
                    number: number,
                    text: text,
                    active: isActive
                };
            }

            function getPages(currentPage, totalPages) {
                var pages = [];

                // Default page limits
                var startPage = 1, endPage = totalPages;
                var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

                // recompute if maxSize
                if (isMaxSized) {
                    if (rotate) {
                        // Current page is displayed in the middle of the visible ones
                        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                        endPage = startPage + maxSize - 1;

                        // Adjust if limit is exceeded
                        if (endPage > totalPages) {
                            endPage = totalPages;
                            startPage = endPage - maxSize + 1;
                        }
                    } else {
                        // Visible pages are paginated with maxSize
                        startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

                        // Adjust last page if limit is exceeded
                        endPage = Math.min(startPage + maxSize - 1, totalPages);
                    }
                }

                // Add page number links
                for (var number = startPage; number <= endPage; number++) {
                    var page = makePage(number, number, number === currentPage);
                    pages.push(page);
                }

                // Add links to move between page sets
                if (isMaxSized && !rotate) {
                    if (startPage > 1) {
                        var previousPageSet = makePage(startPage - 1, '...', false);
                        pages.unshift(previousPageSet);
                    }

                    if (endPage < totalPages) {
                        var nextPageSet = makePage(endPage + 1, '...', false);
                        pages.push(nextPageSet);
                    }
                }

                return pages;
            }

            var originalRender = paginationCtrl.render;
            paginationCtrl.render = function () {
                originalRender();
                if (scope.page > 0 && scope.page <= scope.totalPages) {
                    scope.pages = getPages(scope.page, scope.totalPages);
                }
            };
        }
    };
}])

.constant('uibPagerConfig', {
    itemsPerPage: 10,
    previousText: '« Previous',
    nextText: 'Next »',
    align: true
})

.directive('uibPager', ['uibPagerConfig', function (pagerConfig) {
    return {
        restrict: 'EA',
        scope: {
            totalItems: '=',
            previousText: '@',
            nextText: '@',
            ngDisabled: '='
        },
        require: ['uibPager', '?ngModel'],
        controller: 'UibPaginationController',
        controllerAs: 'pagination',
        //templateUrl: function (element, attrs) {
        //    return attrs.templateUrl || 'template/pagination/pager.html';
        //},
        template: '<ul class="pager"><li ng-class="{disabled: noPrevious()||ngDisabled, previous: align}"><a href ng-click="selectPage(page - 1, $event)">previous</a></li><li ng-class="{disabled: noNext()||ngDisabled, next: align}"><a href ng-click="selectPage(page + 1, $event)">next</a></li></ul>',
        replace: true,
        link: function (scope, element, attrs, ctrls) {
            var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

            if (!ngModelCtrl) {
                return; // do nothing if no ng-model
            }

            scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
            paginationCtrl.init(ngModelCtrl, pagerConfig);
        }
    };
}]);



angular.module('nd.wall', ['ngAnimate'])

.constant('wallConfig', {
    openClass: 'open'
})

.service('wallService', ['$document', '$rootScope', function ($document, $rootScope) {
    var openScope = null;

    this.open = function (dropdownScope) {
        if (!openScope) {
            $document.bind('touchstart', closeDropdown);
            //$document.bind('keydown', keybindFilter);
        }

        if (openScope && openScope !== dropdownScope) {
            openScope.isOpen = false;
        }

        openScope = dropdownScope;
    };

    this.close = function (dropdownScope) {
        if (openScope === dropdownScope) {
            openScope = null;
            $document.unbind('click', closeDropdown);
            //$document.unbind('keydown', keybindFilter);
        }
    };

    var closeDropdown = function (evt) {
        // This method may still be called during the same mouse event that
        // unbound this event handler. So check openScope before proceeding.
        if (!openScope) { return; }

        if (evt && openScope.getAutoClose() === 'disabled') { return; }

        var toggleElement = openScope.getToggleElement();
        if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
            return;
        }

        var dropdownElement = openScope.getDropdownElement();
        if (evt && openScope.getAutoClose() === 'outsideClick' &&
          dropdownElement && dropdownElement[0].contains(evt.target)) {
            return;
        }

        openScope.isOpen = false;

        if (!$rootScope.$$phase) {
            openScope.$apply();
        }
    };

    //var keybindFilter = function (evt) {
    //    if (evt.which === 27) {
    //        openScope.focusToggleElement();
    //        closeDropdown();
    //    } else if (openScope.isKeynavEnabled() && /(38|40)/.test(evt.which) && openScope.isOpen) {
    //        evt.preventDefault();
    //        evt.stopPropagation();
    //        openScope.focusDropdownEntry(evt.which);
    //    }
    //};
}])

.controller('ndWallCtrl', ['$scope', '$attrs', '$parse', 'wallConfig', 'wallService', '$animate', '$document', '$compile', '$templateRequest', function ($scope, $attrs, $parse, wallConfig, wallService, $animate, $document, $compile, $templateRequest) {
    var self = this,
      scope = $scope.$new(), // create a child scope so we are not polluting original one
      templateScope,
      openClass = wallConfig.openClass,
      getIsOpen,
      setIsOpen = angular.noop,
      toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop,
      //appendToBody = false,
      //keynavEnabled = false,
      //selectedOption = null,
      body = $document.find('body');



    this.init = function (element) {
        self.$element = element;

        if ($attrs.isOpen) {
            getIsOpen = $parse($attrs.isOpen);
            setIsOpen = getIsOpen.assign;

            $scope.$watch(getIsOpen, function (value) {
                scope.isOpen = !!value;
            });
        }

        //openClass = wallConfig.openClass,
    };

    this.toggle = function (open) {
        return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
    };

    // Allow other directives to watch status
    this.isOpen = function () {
        return scope.isOpen;
    };

    scope.getToggleElement = function () {
        return self.toggleElement;
    };

    scope.getAutoClose = function () {
        return $attrs.autoClose || 'always'; //or 'outsideClick' or 'disabled'
    };

    scope.getElement = function () {
        return self.$element;
    };

    //scope.isKeynavEnabled = function () {
    //    return keynavEnabled;
    //};

    scope.getDropdownElement = function () {
        return self.dropdownMenu;
    };

    scope.focusToggleElement = function () {
        if (self.toggleElement) {
            self.toggleElement[0].focus();
        }
    };

    scope.$watch('isOpen', function (isOpen, wasOpen) {

        var openContainer = self.$element;

        $animate[isOpen ? 'addClass' : 'removeClass'](openContainer, openClass).then(function () {
            if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
                toggleInvoker($scope, { open: !!isOpen });
            }
        });

        if (isOpen) {

            scope.focusToggleElement();
            wallService.open(scope);
        } else {

            wallService.close(scope);
            //self.selectedOption = null;
        }

        if (angular.isFunction(setIsOpen)) {
            setIsOpen($scope, isOpen);
        }
    });

    $scope.$on('$locationChangeSuccess', function () {
        if (scope.getAutoClose() !== 'disabled') {
            scope.isOpen = false;
        }
    });

    var offDestroy = $scope.$on('$destroy', function () {
        scope.$destroy();
    });
    scope.$on('$destroy', offDestroy);
}])

.directive('ndWall', function () {
    return {
        controller: 'ndWallCtrl',
        link: function (scope, element, attrs, wallCtrl) {
            wallCtrl.init(element);
            element.addClass('nd-wall');
        }
    };
})

.directive('ndWallTogglePub', ["$parse", function ($parse) {
    return {
        //require: '?^ndWall',
        link: function (scope, element, attrs, ctrl) {
            if (!angular.isDefined(attrs.isOpen)) {
                return;
            }

            var getIsOpen,
                setIsOpen = angular.noop;

            getIsOpen = $parse(attrs.isOpen);
            setIsOpen = getIsOpen.assign;

            scope.toggleWallPub = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                var isOpen = getIsOpen(scope);
                setIsOpen(scope, !isOpen);
            };
        }
    };
}])

.directive('ndWallToggle', function () {
    return {
        require: '?^ndWall',
        link: function (scope, element, attrs, wallCtrl) {
            if (!wallCtrl) {
                return;
            }

            element.addClass('nd-wall-toggle');

            wallCtrl.toggleElement = element;

            var toggleDropdown = function (event) {
                event.preventDefault();

                if (!element.hasClass('disabled') && !attrs.disabled) {
                    scope.$apply(function () {
                        wallCtrl.toggle();
                    });
                }
            };

            element.bind('click', toggleDropdown);

            // WAI-ARIA
            element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
            scope.$watch(wallCtrl.isOpen, function (isOpen) {
                element.attr('aria-expanded', !!isOpen);
            });

            scope.$on('$destroy', function () {
                element.unbind('click', toggleDropdown);
            });
        }
    };
});
