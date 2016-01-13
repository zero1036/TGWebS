describe('mainCtrl', function() {
    var scope;
    // var UserInfoService;
    var $httpBackend;
    // var $compile;

    beforeEach(angular.mock.module("myApp"));


    beforeEach(angular.mock.inject(function(_$compile_, $rootScope, $controller, _$httpBackend_) {
        // $compile = _$compile_;

        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', 'data/students.json')
            .respond([{
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

    it('test 1', function() {
        // scope.say();
        expect(scope.age).toBe(12);
    });

    //  it('test 2', function() {
    //     scope.add();
    //     expect(scope.age).toBe(2);
    // });

    it('test 2', function() {

        scope.ask();

        $httpBackend.flush();

        expect(scope.user.length).toBe(2);
    });

    // it('Replaces the element with the appropriate content', function() {
    //     // Compile a piece of HTML containing the directive
    //     var element = $compile("<a-great-eye></a-great-eye>")(scope);
       
    //     // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
    //     scope.$digest();
        
    //     // Check that the compiled element contains the templated content
    //     expect(element.html()).toContain("lidless, wreathed in flame, 2 times");
    // });


});
