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

app.controller('popupNewTeam', ['$scope','$modalInstance','$timeout','$http','domain','$state','$localStorage','$sessionStorage',function ($scope, $modalInstance,$timeout,$http,domain,$state,$localStorage,$sessionStorage) {

var data=$.param({token:sessionStorage.getItem("token")});
$http.post(domain + 'users', data).then(function(response) {
    if(!response.data.success){
      $state.go('access.signin', {});
    }
    $scope.org_users = response.data.users;

},function(){          
  $state.go('access.signin', {});
});

$scope.close = function () {
$modalInstance.dismiss('cancel');
};

$scope.createTeam=function(){

	var data = $.param({
	token: sessionStorage.getItem("token"),
	"team_name": $scope.team.teamName,
	"team_desc": $scope.team.description,
	"team_followers":JSON.stringify($scope.team.followers)
	});

	$http.post(domain + 'createTeam', data).then(function(response) {
	if(!response.data.success){
	  $state.go('access.signin', {});
	}
	$scope.close();	
	var obj={"team_id":response.data.team_id};
	$sessionStorage.currentTeamDetails = obj;
	$state.go('app.dashboard', {}, { reload: true });

	},function(){          
          $state.go('access.signin', {});
        });
}

setTimeout(function(){$("#teamName").focus()},1000);


}]);

app.controller('popupNewUser', ['$scope','$modalInstance','$timeout','$http','domain','$state','$localStorage','$sessionStorage',function ($scope, $modalInstance,$timeout,$http,domain,$state,$localStorage,$sessionStorage) {
	$scope.close = function () {
	$modalInstance.dismiss('cancel');
	};

	$scope.createUser=function(){

	var data = $.param({
	token: sessionStorage.getItem("token"),
	"user":JSON.stringify($scope.user)
	});

	$http.post(domain + 'createUser', data).then(function(response) {
	if(!response.data.success){
	  $state.go('access.signin', {});
	}
	$scope.close();
	$state.go('app.dashboard', {}, { reload: true });

	},function(){          
          $state.go('access.signin', {});
        });

	}

	setTimeout(function(){$("#firstName").focus()},1000);
	
}]);