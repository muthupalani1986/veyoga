'use strict';

app.controller('sidenav', ['$scope', '$http', '$state','domain','$sce','$rootScope','socket', function($scope, $http, $state,domain,$sce,$rootScope,socket) {
 $scope.parentobj = {};
$scope.parentobj.currentTab='myTasks';
$scope.parentobj.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
var data=$.param({token:sessionStorage.getItem("token")});
$http.post(domain+'sidenav',data).then(function(response){                        
  $scope.parentobj.sidenav=response.data.sidenav;
  
  if(response.data.success==false){
   $state.go('access.signin', {});
  }

});



$scope.myTasks=function(){
$('.navi ul li').removeClass('active');
var data=$.param({token:sessionStorage.getItem("token")});
$http.post(domain+'myTasks',data).then(function(response){                        
   $scope.parentobj.tasks=response.data.myTasks;
    $scope.parentobj.commentPanel=false;
    $scope.parentobj.currentTab='myTasks';
    $scope.parentobj.projectID=0;
  if(!response.data.success){
      $state.go('access.signin', {});
    }

},function(){          
          $state.go('access.signin', {});
        });

}

$scope.myTasks();

$scope.getTasks=function(projectDetails){        
        var data=$.param({token:sessionStorage.getItem("token"),projectID:projectDetails.pro_id});
        $http.post(domain+'getTasks',data).then(function(response){          
        $scope.parentobj.tasks=response.data.tasks; 
        $scope.parentobj.projectID=projectDetails.pro_id;
        $scope.parentobj.proDetails=projectDetails;
        $scope.parentobj.commentPanel=false; 
        $scope.parentobj.currentPosition=null;  
        $scope.parentobj.currentTab='getTasks';
        if(!response.data.success){
          $state.go('access.signin', {});
        }

        },function(){          
          $state.go('access.signin', {});
        });
}

/*$scope.mytask=function(){  
  var data=$.param({token:sessionStorage.getItem("token")});
  $http.post(domain+'myTasks',data).then(function(response){                        
    $scope.parentobj.tasks=response.data.myTasks;
    //$scope.commentPanel=false;
    $scope.parentobj.commentPanel=false;
    $scope.parentobj.currentTab='myTasks';
    $scope.parentobj.projectID=0;
    if(!response.data.success){
      $state.go('access.signin', {});
    }

  },function(){          
          $state.go('access.signin', {});
        });
}*/

$scope.logout=function(){
  socket.emit('logoff',"");
  sessionStorage.removeItem('token');
  $state.go('access.signin', {});
}

$scope.myInbox=function(){
  $scope.resetActions();
var data=$.param({token:sessionStorage.getItem("token")});
  $http.post(domain+'myInbox',data).then(function(response){
  $scope.parentobj.inbox=response.data.inbox.inbox;
  setHeight();
  if(!response.data.success){
  $state.go('access.signin', {});
  }
  },function(){          
  $state.go('access.signin', {});
  });
  
}

$scope.resetActions=function(){
  $('.navi ul li').removeClass('active'); 
  $scope.parentobj.commentPanel=false; 
  $scope.parentobj.currentPosition=null;  
  $scope.parentobj.currentTab='myInbox';
  $scope.parentobj.projectID=null;
  $scope.parentobj.currentViewTaskID="";
}

function setHeight() {
        var windowHeight = $(window).innerHeight() - 80;
        $('.task-holder-panel').css('height', windowHeight);
        $('.inbox-holder').css('height', windowHeight - 80);        
        $('.task-conv-holder').css('height', windowHeight - 220);
    };
    
    $(window).resize(function() {
        setHeight();
    });


  }]);


