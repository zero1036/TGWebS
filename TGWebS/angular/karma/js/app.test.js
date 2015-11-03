describe('mainCtrl', function() {
    var scope;
    var UserInfoService;

    beforeEach(angular.mock.module("myApp"));


    beforeEach(angular.mock.inject(function($rootScope, $controller, _UserInfoService) {

        UserInfoService = _UserInfoService;
        service.query().respond([{
            id: 1,
            name: 'Bob'
        }, {
            id: 2,
            name: 'Jane'
        }]);

        //create an empty scope
        scope = $rootScope.$new();

        //declare the controller and inject our empty scope
        $controller('mainCtrl', {
            $scope: scope
        });

    }));

    // it('should have variable text = "Hello World!"', function() {
    //     scope.say();
    //     expect(scope.age).toBe(32);
    // });

    it('2', function() {
        scope.ask();
        expect(scope.user.length).toBe(2);
    });


});
