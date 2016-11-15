'use strict';

app.controller('sidenav', ['$scope', '$http', '$state','domain','$sce','$rootScope','socket', '$modal','$localStorage','$sessionStorage',function($scope, $http, $state,domain,$sce,$rootScope,socket,$modal,$localStorage,$sessionStorage) {
 $scope.parentobj = {};
$scope.parentobj.currentTab='myTasks';
$scope.parentobj.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if(angular.isDefined($sessionStorage.currentProjectDetails)){
    $scope.parentobj.currentProjectID=$sessionStorage.currentProjectDetails.project_id;    
}
if(angular.isDefined($sessionStorage.currentTeamDetails)){    
    $scope.parentobj.currentTeamId=$sessionStorage.currentTeamDetails.team_id;}

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
        var obj={"project_id":projectDetails.pro_id}
        $sessionStorage.currentProjectDetails = obj;
        $scope.parentobj.currentProjectID=projectDetails.pro_id;
        if(!response.data.success){
          $state.go('access.signin', {});
        }

        },function(){          
          $state.go('access.signin', {});
        });
}


$scope.logout=function(){
  socket.emit('logoff',"");
  sessionStorage.removeItem('token');
  delete $sessionStorage.currentProjectDetails;
  delete $sessionStorage.currentTeamDetails;
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



$scope.newProPopup = function (teamObject) {
  
  var modalInstance = $modal.open(
    {templateUrl: 'tpl/popups/new_project.html',controller:'popupNewProject',
    resolve: {
      team:function(){
        return teamObject;
      }
    }
});

}

$scope.newTeamPopup = function () {  
  var modalInstance = $modal.open({templateUrl: 'tpl/popups/new_team.html',controller:'popupNewTeam'});

}

$scope.setTeamValue=function(team){  
  var obj={"team_id":team.team.team_id};
  $sessionStorage.currentTeamDetails = obj;  
}


$scope.addUser = function () {  
  var modalInstance = $modal.open({templateUrl: 'tpl/popups/new_user.html',controller:'popupNewUser'});
}


  }]);


