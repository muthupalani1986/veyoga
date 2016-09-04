'use strict';

app.controller('sidenav', ['$scope', '$http', '$state','domain','$sce','$rootScope', function($scope, $http, $state,domain,$sce,$rootScope) {
 $scope.parentobj = {};
$scope.parentobj.currentTab='myTasks';
var data=$.param({token:localStorage.getItem("token")});
$http.post(domain+'sidenav',data).then(function(response){                        
  $scope.parentobj.sidenav=response.data.sidenav;
});

var data=$.param({token:localStorage.getItem("token")});
$http.post(domain+'myTasks',data).then(function(response){                        
   $scope.parentobj.tasks=response.data.myTasks;
},function(){          
          $state.go('access.signin', {});
        });

$scope.getTasks=function(projectDetails){        
        var data=$.param({token:localStorage.getItem("token"),projectID:projectDetails.pro_id});
        $http.post(domain+'getTasks',data).then(function(response){  
         $scope.parentobj.tasks=response.data; 
         $scope.parentobj.projectID=projectDetails.pro_id;
         $scope.parentobj.proDetails=projectDetails;
          $scope.parentobj.commentPanel=false; 
          $scope.parentobj.currentPosition=null;  
          $scope.parentobj.currentTab='getTasks';      
        },function(){          
          $state.go('access.signin', {});
        });
}

$scope.mytask=function(){  
  var data=$.param({token:localStorage.getItem("token")});
  $http.post(domain+'myTasks',data).then(function(response){                        
    $scope.parentobj.tasks=response.data.myTasks;
    //$scope.commentPanel=false;
    $scope.parentobj.commentPanel=false;
    $scope.parentobj.currentTab='myTasks';
    $scope.parentobj.projectID=0;
  },function(){          
          $state.go('access.signin', {});
        });
}


  }]);


