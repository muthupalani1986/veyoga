'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state','domain', function($scope, $http, $state,domain) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      // Try to login
      var data = $.param({
                username: $scope.user.email,
                password: $scope.user.password
            });
     
      $http.post(domain+'authenticate',data)
      .then(function(response) {
        if ( !response.data.success ) {
          $scope.authError = response.data.message;
        }else{
          sessionStorage.setItem("token",response.data.token);
          sessionStorage.setItem("currentUser",JSON.stringify(response.data.userDetails));
          $state.go('app.dashboard');
        }
      }, function(x) {
       $scope.authError = 'Server Error';
       //$state.go('app.dashboard-v1'); 
      });
    };
  }])
;