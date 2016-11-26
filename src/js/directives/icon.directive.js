angular.module('app').directive('iconTaskCheckbox', function() {
	return {
			restrict: 'E',
			templateUrl:'tpl/icons/icon-taskcheckbox.html'
		}
  }).directive('iconTaskCheckboxCompleted', function() {
	return {
			restrict: 'E',
			templateUrl:'tpl/icons/icon-taskcheckboxCompleted.html'
		}
  }).directive('iconTaskCompletedCheckMark', function() {
	return {
			restrict: 'E',
			scope: {
				taskStatus:"@taskStatus"
			},

			templateUrl:'tpl/icons/icon-taskCompletedCheckmark.html'
		}
  }).directive('iconSubtask', function() {
	return {
			restrict: 'E',
			templateUrl:'tpl/icons/icon-subtask.html'
		}
  }).directive('iconAttachment', function() {
	return {
			restrict: 'E',
			templateUrl:'tpl/icons/icon-attachment.html'
		}
  }).directive('iconMoreActionsPanel', function() {
	return {
			restrict: 'E',
			templateUrl:'tpl/icons/icon-moreActionsCommentPanel.html'
		}
  }).directive('iconMore', function() {
	return {
			restrict: 'E',
			templateUrl:'tpl/icons/iconMore.html'
		}
  }).directive('iconTaskRepeat', function() {
	return {
			restrict: 'E',
			templateUrl:'tpl/icons/iconTaskRepeat.html'
		}
  }).directive('iconRepeatRecurrenceView', function() {
	return {
			restrict: 'E',
			templateUrl:'tpl/icons/icon-repeatRecurrenceView.html'
		}
  });