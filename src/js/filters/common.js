'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app')
  .filter('dateTimeMoment', function() {
    return function(due_on,colorIndicator) {
    	var returnClass=false;
    	if(typeof colorIndicator!="undefined")
    	{
    		returnClass=true;
    	}    	

		var REFERENCE = moment(); // fixed just for testing, use moment();
		var TODAY = REFERENCE.clone().startOf('day');
		var YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
		var A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');
		var TOMORROW = REFERENCE.clone().add(1, 'days').startOf('day');
		function isToday(momentDate) {
		    return momentDate.isSame(TODAY, 'd');
		}
		function isYesterday(momentDate) {
		    return momentDate.isSame(YESTERDAY, 'd');
		}
		function isTomorrow(momentDate) {
		    return momentDate.isSame(TOMORROW, 'd');
		}

		function isWithinAWeek(momentDate) {
		    return momentDate.isAfter(A_WEEK_OLD);
		}
		function isTwoWeeksOrMore(momentDate) {
		    return !isWithinAWeek(momentDate);
		}

		if(isToday(moment(due_on))){
			if(returnClass)
			{
			 return "due_soon";
			}
			else
			{
				return "Today";
			}
		}
		if(isYesterday(moment(due_on))){			
			if(returnClass){
				return "overdue";
			}
			else
			{
				return "Yesterday";
			}
		 
		}
		if(isTomorrow(moment(due_on))){
			if(returnClass)
			{
			 return "due_soon";
			}
			else
			{
				return "Tomorrow";
			}
		}	

		var currentDateISO=new Date().toISOString();
		var currentDate = moment(currentDateISO);
		var dueDate = moment(due_on);
		var noOfdays = dueDate.diff(currentDate, 'days');
		
		if(returnClass)
		{
			if(noOfdays>=1 && noOfdays<2 ){
				return "due_soon";
			}
			else if(noOfdays<0)
			{
				return 'overdue';
			}
			else{
				return '';
			}
		}
		else{

			if(noOfdays>=1 && noOfdays<6 ){
				return moment(due_on).format('dddd');
			}

		}

		if(returnClass){

			return '';
		}
		else
		{

			var isValid=moment(due_on).isValid();			
			if(isValid){
			var currentDateISO=new Date().toISOString();
			var currentYear = moment(currentDateISO).format("YYYY");
			var dueOnYear=moment(due_on).format("YYYY");
			if(dueOnYear==currentYear){
				return moment(due_on).format('MMM DD');
			}
			else{
				return moment(due_on).format('MMM DD, YYYY');
			}
			

			}
			else
			{
				return '';
			}

		}

		
    }
  });
