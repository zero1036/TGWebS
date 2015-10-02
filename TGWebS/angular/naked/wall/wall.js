angular.module('nd.wall', [])

.constant('dropdownConfig', {
    openClass: 'open pt-page-moveFromRight'
})

.service('dropdownService', ['$document', '$rootScope', function ($document, $rootScope) {
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

.controller('ndWallCtrl', ['$scope', '$attrs', '$parse', 'dropdownConfig', 'dropdownService', '$animate', '$document', '$compile', '$templateRequest', function ($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate, $document, $compile, $templateRequest) {
    var self = this,
      scope = $scope.$new(), // create a child scope so we are not polluting original one
      templateScope,
      openClass = dropdownConfig.openClass,
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
            dropdownService.open(scope);
        } else {


            dropdownService.close(scope);
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

.directive('test', function () {
    return {
        //require: '?^ndWall',
        link: function (scope, element, attrs, ctrl) {
          
            //element.attr({ 'ng-click': 'toggleDropdown($event)' });

            //scope.toggleDropdown = function ($event) {
            //    $event.preventDefault();
            //    $event.stopPropagation();
            //    scope.status.isopen = !scope.status.isopen;
            //};

            //element.bind("click", function () {
            //    scope.preventDefault();
            //    scope.stopPropagation();
            //    scope.status.isopen = !scope.status.isopen;
            //});

          
        }

    };
})

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
