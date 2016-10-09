angular.module('app').factory('socket', function ($rootScope, $timeout) {
	var socketUrl="http://localhost:3000";
  var socket=io.connect(socketUrl);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $timeout(function(){
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
        },0);


      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
         $timeout(function(){
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
         },0)

      })
    },
    storeClientInfo:function(){
    	var currentSocketUsr=JSON.parse(sessionStorage.getItem("currentUser"));
    	socket.emit('storeClientInfo',{"currentSocketUsr":currentSocketUsr});
    },
    reconnectSocket:function(){    	
    	if(socket.connected==false){    		
    		socket = io.connect(socketUrl);
    	}
    }
  };
});