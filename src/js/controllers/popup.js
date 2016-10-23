'use strict';
app.controller('popupNewProject', ['$scope','$modalInstance','$timeout','$http','domain','team','$state','$localStorage','$sessionStorage',function ($scope, $modalInstance,$timeout,$http,domain,team,$state,$localStorage,$sessionStorage) {
$scope.showDescription=false;
$scope.close = function () {
$modalInstance.dismiss('cancel');
};

$scope.addProDescription=function(){	
	$scope.showDescription=true;
}

$scope.createProject=function(){

	var data = $.param({
	token: sessionStorage.getItem("token"),
	"pro_name": $scope.pro.proName,
	"pro_description": $scope.pro.description,
	"team_id":team.team_id
	});

	$http.post(domain + 'createProject', data).then(function(response) {
	if(!response.data.success){
	  $state.go('access.signin', {});
	}
	$scope.close();	
	var obj={"project_id":response.data.project_id};
	$sessionStorage.currentProjectDetails = obj;
	var obj={"team_id":team.team_id};
	$sessionStorage.currentTeamDetails = obj;		
	$state.go('app.dashboard', {}, { reload: true });

	},function(){          
          $state.go('access.signin', {});
        });
}

setTimeout(function(){$("#proName").focus()},1000);


}]);