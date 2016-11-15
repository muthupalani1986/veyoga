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

		if(due_on==""||due_on==null){
			return;
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
  })
  .filter('convCreatedDateTime', function() {

  		return function(created_at){

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

		if(isToday(moment(created_at))){

				return 'Today'+' at '+moment(created_at).format('h:mm a');
			}

		if(isYesterday(moment(created_at))){
				return 'Yesterday'+' at '+moment(created_at).format('h:mm a');
		}

		if(isWithinAWeek(moment(created_at))){
			return moment(created_at).format('dddd') +' at '+moment(created_at).format('h:mm a');
		}
  			var isValid=moment(created_at).isValid();			
			if(isValid){
			var currentDateISO=new Date().toISOString();
			var currentYear = moment(currentDateISO).format("YYYY");
			var dueOnYear=moment(created_at).format("YYYY");
			if(dueOnYear==currentYear){
				return moment(created_at).format('MMM DD')+' at '+moment(created_at).format('h:mm a');
			}
			else{
				return moment(created_at).format('MMM DD, YYYY') +' at '+moment(created_at).format('h:mm a');
			}
			

			}
			else
			{
				return '';
			}

  		}
  })
  .filter('storyaffected', function() {
  	return function(logData){
  		var currentUser = JSON.parse(sessionStorage.getItem('currentUser')); 
  		if(logData.act_id==1){
  			return '';
  		}
  		if(logData.act_id==2 ||logData.act_id==8){

  			if(currentUser.user_id==logData.assigned_to){

  				return 'you'+'. ';
  			}
  			else
  			{
  				return logData.assignee_name+'. ';
  			}
  		}
  		if(logData.act_id==3){
  			return logData.pro_name +'. ';
  		}

  		if(logData.act_id==4){

  			 var isValid=moment(logData.due_date).isValid();			
			if(isValid){
			var currentDateISO=new Date().toISOString();
			var currentYear = moment(currentDateISO).format("YYYY");
			var dueOnYear=moment(logData.due_date).format("YYYY");
			if(dueOnYear==currentYear){
				return moment(logData.due_date).format('MMM DD')+'. ';
			}
			else{
				return moment(logData.due_date).format('MMM DD, YYYY')+'. ';
			}
			

			}
			else
			{
				return '';
			}

  			//return logData.due_date;

  		}  		

  		return '';
  	}

  });
