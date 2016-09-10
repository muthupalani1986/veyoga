'use strict';
app.controller('dashboard', ['$scope', '$http', '$state', 'domain', '$sce','$filter','Upload','$timeout', function($scope, $http, $state, domain, $sce,$filter,Upload, $timeout) {

    $scope.currentTask;
    $scope.serviceUrl=domain;
    $scope.parentobj.token=localStorage.getItem("token");
    var datefilter = $filter('date');
    $scope.addTask = function(isSection) {
        var is_section;
        var task_name;
        if (typeof isSection != 'undefined') {
            is_section = 1;
            task_name = 'New Section:';
        } else {
            is_section = 0;
            task_name = '';
        }

        var data = $.param({
            token: localStorage.getItem("token"),
            task_name: task_name,
            task_description: '',
            projectID: $scope.parentobj.projectID,
            currentTab: $scope.parentobj.currentTab,
            isSection: is_section
        });
        $http.post(domain + 'createTask', data).then(function(response) {
            var position;
            if ($scope.parentobj.tasks.length == 0) {
                position = 0;
            } else {
                position = $scope.parentobj.currentPosition + 1;
            }

            if (is_section) {
                response.data.task[0].section_id = null;
                response.data.task[0].section_name = null;
            } else {
                if (position > 0) {
                    if ($scope.parentobj.tasks[position - 1].is_section) {
                        response.data.task[0].section_id = $scope.parentobj.tasks[position - 1].task_id;
                        response.data.task[0].section_name = $scope.parentobj.tasks[position - 1].task_name;
                    } else {
                        response.data.task[0].section_id = $scope.parentobj.tasks[position - 1].section_id;
                        response.data.task[0].section_name = $scope.parentobj.tasks[position - 1].section_name;
                    }

                }
            }

            

            $scope.parentobj.tasks.splice(position, 0, response.data.task[0]);

            if (response.data.task[0].is_section) {
                
                for (var i = position; i < $scope.parentobj.tasks.length; i++) {
                    if ($scope.parentobj.tasks[i].is_section && i > position) {
                        break;
                    }
                    if (i > position) {
                        $scope.parentobj.tasks[i].section_name = response.data.task[0].task_name;
                        $scope.parentobj.tasks[i].section_id = response.data.task[0].task_id;
                    }
                }
            }

            var data = $.param({
                token: localStorage.getItem("token"),
                "tasks": JSON.stringify($scope.parentobj.tasks)
            });
            $http.post(domain + 'updateTaskPriority', data).then(function(response) {});
        },function(){          
          $state.go('access.signin', {});
        });

    }
    $scope.data = {};
    $scope.viewTask = function(currentScope, details, currentPosition) {
        $scope.currentTask = currentScope;
        $scope.task = currentScope.task;
        $scope.parentobj.commentPanel = true;
        $scope.parentobj.currentPosition = currentPosition;
        var data = $.param({
            token: localStorage.getItem("token"),
            taskID: $scope.currentTask.task.task_id
        });        
         
        if($scope.currentTask.task.due_on=="0000-00-00 00:00:00"){
            $scope.dueDate="";
        }
        else
        {
            $scope.dueDate=$scope.currentTask.task.due_on;
        }
        $scope.files="";
        $http.post(domain + 'getConversations', data).then(function(response) {
            $scope.coversation = response.data.coversation;
            $scope.attachments = response.data.attachments;
            $scope.data.followers = [];
            $.grep(response.data.followers, function(item) {
                $scope.data.followers.push(item.user_id);
            });

            $('.task-conv-holder').animate({
                scrollTop: 0
            }, 0);

            $scope.followStatus();
        },function(){          
          $state.go('access.signin', {});
        });

        $http.post(domain + 'users', data).then(function(response) {
            $scope.org_users = response.data.users;

            var assigneeFindResult=$.grep($scope.org_users,function(item){
                if(item.user_id==$scope.currentTask.task.assignee){
                    return true;
                }
            });

            if(assigneeFindResult.length>0)
            {
                $scope.parentobj.selectedAssignee=assigneeFindResult[0];
            }
            else{
                $scope.parentobj.selectedAssignee="";
            }


        },function(){          
          $state.go('access.signin', {});
        });
    }

    $scope.syncToTaskPanel = function() {
        $scope.currentTask.task = $scope.task;
    }

    $scope.closeConversationPanel = function() {
        $scope.parentobj.commentPanel = false;
    }

    $scope.today = function() {
        $scope.dueDate=datefilter($scope.dueDate, 'dd-MMMM-yyyy');
    };
    //$scope.today();

    $scope.clear = function() {
        $scope.dueDate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
        $scope.assigneeOrgusersBoxStatus=false;  
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];    

    $scope.postConv = function() {

        var data = $.param({
            token: localStorage.getItem("token"),
            taskID: $scope.currentTask.task.task_id,
            message: $('.conv-editor').html()
        });
        $http.post(domain + 'logConversation', data).then(function(response) {
            $scope.coversation.push(response.data.conversations[0]);
            $('.conv-editor').html('');
            $(".task-conv-holder").animate({
                scrollTop: $('.task-conv-holder').prop("scrollHeight")
            }, 20);

        },function(){          
          $state.go('access.signin', {});
        });

    }

    $scope.trustAsHtml = $sce.trustAsHtml;

    $scope.updateTaskName = function(currentScope) {
        var data = $.param({
            token: localStorage.getItem("token"),
            taskID: currentScope.task_id,
            task_name: currentScope.task_name
        });
        if (currentScope.is_section == 1) {
            $scope.parentobj.tasks = $.grep($scope.parentobj.tasks, function(item) {
                if (item.section_id == currentScope.task_id) {
                    item.section_name = currentScope.task_name;
                    return true;
                } else {
                    return true;
                }
            });
        }

        $http.post(domain + 'updateTaskName', data).then(function(response) {},function(){          
          $state.go('access.signin', {});
        });



    }

    $scope.updateTaskDescription = function(currentScope) {
        var data = $.param({
            token: localStorage.getItem("token"),
            taskID: currentScope.task_id,
            task_description: currentScope.task_description
        });
        $http.post(domain + 'updateTaskDescription', data).then(function(response) {},function(){          
          $state.go('access.signin', {});
        });
    }


    var fixHelper = function(e, ui) {
        ui.children().each(function() {
            $(this).width($(this).width());
        });
        return ui;
    };

    $scope.sortableOptions = {
        handle: '> .myHandle',
        update: function(e, ui) {},
        stop: function(e, ui) {
            var lastSectionID = null;
            var lastSectionName = null;
            $scope.parentobj.tasks = $.grep($scope.parentobj.tasks, function(item, index) {
                if (item.is_section) {
                    lastSectionID = item.task_id;
                    lastSectionName = item.task_name;
                    item.section_id = null;
                    item.section_name = null;
                } else {
                    item.section_id = lastSectionID;
                    item.section_name = lastSectionName;
                }
                return true;

            });
            

            var data = $.param({
                token: localStorage.getItem("token"),
                "tasks": JSON.stringify($scope.parentobj.tasks)
            });
            $http.post(domain + 'updateTaskPriority', data).then(function(response) {},function(){          
          $state.go('access.signin', {});
        });

        },

        helper: fixHelper
    };

    function setHeight() {
        var windowHeight = $(window).innerHeight() - 150;
        $('.task-holder-panel').css('height', windowHeight);
        $('.task-holder').css('height', windowHeight - 80);
        $('.task-conv-holder').css('height', windowHeight - 300);
    };
    setHeight();
    $(window).resize(function() {
        setHeight();
    });

    $scope.followersbox = false;


    //$scope.follow=["CA"];
    $scope.addFollowers = function() {
        $scope.followersbox = true;
    }

    $scope.$watch('data.followers', function(newValue, oldvalue) {
        if (newValue != oldvalue) {
            var followerData=[];
            for(var i=0;i<$scope.data.followers.length;i++)
            {
                var data=[$scope.data.followers[i],$scope.currentTask.task.task_id];
                followerData.push(data);
            }
            
            var data = $.param({
                token: localStorage.getItem("token"),
                taskID: $scope.currentTask.task.task_id,                
                followerData:JSON.stringify(followerData)
            });

            $http.post(domain + 'taskFolllowers', data).then(function(response) {
                //console.log("succ");
            },function(){          
          $state.go('access.signin', {});
        });
            $scope.followStatus();
        }
    },true);


    $(window).click(function(e) {

        if (!$(e.target).hasClass('add-follows')) {
            if (!$('.chosen-container').hasClass('chosen-container-active')) {
                $scope.$apply(function() {
                    $scope.followersbox = false;
                });
            }

        }

        if(!$(e.target).parents().hasClass('assignee-row'))
        {
                $scope.$apply(function() {
                        $scope.assigneeOrgusersBoxStatus=false;                        
                });
        }



    });

    $scope.followTask = function() {
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));                
        var taskFollow = angular.copy($scope.data.followers);
        if (taskFollow.indexOf(currentUser.user_id) == -1) {
            taskFollow.push(currentUser.user_id);
            $scope.userFollowStatus=true;
        }
        $scope.data.followers=taskFollow;
    }
    $scope.unfollowTask = function() {
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        var taskFollow = angular.copy($scope.data.followers);
        var elePosition=taskFollow.indexOf(currentUser.user_id);
        if (elePosition >-1) {
            taskFollow.splice(elePosition, 1);
            $scope.userFollowStatus=false;
        }        
        $scope.data.followers=taskFollow;
    }

$scope.followStatus=function(){
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if ($scope.data.followers.indexOf(currentUser.user_id) == -1) {            
            $scope.userFollowStatus=false;            
        }
        else
        {
            $scope.userFollowStatus=true;
            
        }
    }

$scope.assignTo=function(assignTo){    
    $scope.assigneeOrgusersBoxStatus=false;        
    $scope.parentobj.selectedAssignee=assignTo;
    $scope.currentTask.task.assignee=assignTo.user_id;
    var data = $.param({
                token: localStorage.getItem("token"),
                taskID: $scope.currentTask.task.task_id,
                assignee: assignTo.user_id
            });
            $http.post(domain + 'updateAssignee', data).then(function(response) {
                console.log("succ");
            },function(){          
          $state.go('access.signin', {});
        });

        var taskFollow = angular.copy($scope.data.followers);
        if (taskFollow.indexOf(assignTo.user_id) == -1) {
            taskFollow.push(assignTo.user_id);            
        }
        $scope.data.followers=taskFollow;

}

$scope.enableOrgUsersBox=function(){
$scope.assigneeOrgusersBoxStatus=true;
$scope.searchAssignee="";
}

$scope.unassignee=function(){
    var data = $.param({
            token: localStorage.getItem("token"),
            taskID: $scope.currentTask.task.task_id,
            assignee: 0
        });
        $scope.currentTask.task.assignee="";
        $scope.parentobj.selectedAssignee="";
        $http.post(domain + 'updateAssignee', data).then(function(response) {
            console.log("succ");
        },function(){          
      $state.go('access.signin', {});
    });


}

$scope.$watch('dueDate', function(newValue, oldvalue) {
    if(newValue!=oldvalue){          
        var due_on=datefilter(newValue, 'yyyy-MM-dd HH:mm:ss');
        if(typeof due_on=="undefined" || due_on=="" || due_on === null){
           due_on="0000-00-00 00:00:00"; 
           $scope.currentTask.task.due_on="";
        }
        else
        {
            var dueDate=$filter('filter')(due_on,'yyy-MM-dd');
           var extractDate= dueDate.split(" ");
           var splitDate=extractDate[0].split('-');
           var validDueOn=splitDate[0]+"-"+splitDate[1]+"-"+splitDate[2];           
            $scope.currentTask.task.due_on=validDueOn; 
            
        }
        var data = $.param({
            token: localStorage.getItem("token"),
            taskID: $scope.currentTask.task.task_id,
            due_on: due_on
        });        
            

        $http.post(domain + 'updateDueDate', data).then(function(response) {
            console.log("succ");
        },function(){          
      $state.go('access.signin', {});
    });

    }
},true);

$scope.removeDueDate=function(){
$scope.currentTask.task.due_on="";
$scope.dueDate="";
}


$scope.uploadFiles = function(files, errFiles) {
        $scope.files = files;        
        $scope.errFiles = errFiles;
        $scope.isUploadInProgress=false;
        angular.forEach(files, function(file) {
            console.log("here");
            file.upload = Upload.upload({
                url: domain +'saveAttachment?token='+$scope.parentobj.token,
                data: {taskID:$scope.currentTask.task.task_id,file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    file.attach_id=response.data.attach_id;
                    console.log(response.data.attach_id);
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
                console.log(file.progress);
                if(file.progress!=100){
                    $scope.isUploadInProgress=true;
                }
                else
                {   
                    $scope.isUploadInProgress=false;
                }
            });
        });
    }

$scope.removeAttach=function(attachment,removeFrom){
    
    if(removeFrom=='attachments'){
        $scope.attachments=$.grep($scope.attachments,function(item,index){

            if(item.attach_id==attachment.attach_id){
                return false;
            }
            else
            {
                return true;
            }
        });
    }

    if(removeFrom=='files'){
        $scope.files=$.grep($scope.files,function(item,index){

            if(item.attach_id==attachment.attach_id){
                return false;
            }
            else
            {
                return true;
            }
        });
    }


    var data = $.param({
        token: localStorage.getItem("token"),
        assert_id: attachment.attach_id
    });        


    $http.post(domain + 'deleteAssert', data).then(function(response) {
    
    },function(){          
   // $state.go('access.signin', {});
    });


}

}]);