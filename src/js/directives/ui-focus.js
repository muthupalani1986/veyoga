angular.module('app')
  .directive('uiFocus', function($timeout, $parse) {
    return {
      link: function(scope, element, attr) {
        var model = $parse(attr.uiFocus);
        scope.$watch(model, function(value) {
          if(value === true) {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
        element.bind('blur', function() {
           scope.$apply(model.assign(scope, false));
        });
      }
    };
  }).directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {         
          
            if (scope.$last === true) {
                $timeout(function () {                   
                   $('.currentInboxTask').trigger('click');
                   $('.current-project').trigger('click');
                },100);
            }
        }
    }
}).directive('afterRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
                $timeout(function () {                   
                   $('.navi').css('height', $(window).innerHeight());
                   Scrollbar.initAll();
                },100);
            
        }
    }
});