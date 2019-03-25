var ws;

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('MainCtrl', function($scope, $document) {
    console.log('MainCtrl loaded.');

    var SERVER_URL = 'wss://p2pfo5t498.execute-api.us-east-1.amazonaws.com/gyms';

    $scope.showGymsScreen = true;
	$scope.showLoadButton = true;

    $scope.messageLog = '';
	$scope.list_gyms = [];
	
    function toggleScreens() {
        $scope.showGymsScreen = !$scope.showGymsScreen;
    }

    /** This function initiates the connection to the web socket server. */
    function connect() {
        // Create a new WebSocket to the SERVER_URL (defined above). The empty
        // array ([]) is for the protocols, which we are not using for this
        // demo.
        ws = new WebSocket(SERVER_URL, []);
        // Set the function to be called when a message is received.
        ws.onmessage = handleMessageReceived;
        // Set the function to be called when we have connected to the server.
        ws.onopen = handleConnected;
        // Set the function to be called when an error occurs.
        ws.onerror = handleError;
    }

    /**
        This is the function that is called when the WebSocket receives
        a message.
    */
    function handleMessageReceived(data) {
		// Simply call logMessage(), passing the received data.
        logMessage(data.data);
		
		var msg = JSON.parse(JSON.parse(data.data));
		
		if (msg.option == 'get') {
			$scope.showLoadButton = false;
			console.log(msg.gyms);
			$scope.list_gyms = msg.gyms;
			document.getElementById("gymLst").innerHTML = "<div class='list'></div>";
			
			for (var _g in msg.gyms) {
				var _item = document.createElement('ion-item');
				_item.setAttribute('class', 'item');
				_item.setAttribute('id', msg.gyms[_g]._id);
				
				var _button = document.createElement('ion-button');
				_button.setAttribute('color', 'danger');
				_button.setAttribute('slot', 'end');
				_button.setAttribute('class', 'ion-color ion-color-danger button button-solid ion-activatable ion-focusable ');
				_button.setAttribute('onclick', 'deleteItem(\'' + msg.gyms[_g]._id + '\');');
				var _icon = document.createElement('ion-icon');
				_icon.setAttribute('slot', 'icon-only');
				_icon.setAttribute('name', 'trash');
				_icon.setAttribute('class', 'button-native');
				_button.appendChild(document.createTextNode('Eliminar'));
				_button.appendChild(_icon);
				_item.appendChild(_button);
				
				var _label = document.createElement('ion-label');
				var _h3 = document.createElement('h3');
				_h3.appendChild(document.createTextNode(msg.gyms[_g].name));
				var _desc = document.createTextNode(msg.gyms[_g].services);
				_label.appendChild(_h3);
				_label.appendChild(_desc);
				_item.appendChild(_label);
				
				document.getElementById("gymLst").getElementsByTagName("div")[0].appendChild(_item);
			}
		} else if (msg.option == 'delete') {
			var _delete = document.getElementById(msg.id);
			if(_delete) {
				_delete.remove();
			}
		} else if (msg.option == 'add' || msg.option == 'edit') {
			getGyms();
		}
		
		 $scope.$apply();
    }

    /**
        This is the function that is called when the WebSocket connects
        to the server.
    */
    function handleConnected(data) {
        // Create a log message which explains what has happened and includes
        // the url we have connected too.
        var logMsg = 'Connected to server: ' + data.target.url;
        // Add the message to the log.
        logMessage(logMsg);
		
		getGyms();
    }

    /**
        This is the function that is called when an error occurs with our
        WebSocket.
    */
    function handleError(err) {
        // Print the error to the console so we can debug it.
        console.log("Error: ", err);
    }

    /** This function adds a message to the message log. */
    function logMessage(msg) {
		// console.log("logMessage", msg);
        // $apply() ensures that the elements on the page are updated
        // with the new message.
        $scope.$apply(function() {
            //Append out new message to our message log. The \n means new line.
            $scope.messageLog = $scope.messageLog + msg + "\n";
            // Update the scrolling (defined below).
            updateScrolling();
        });
    }

    /**
        Updates the scrolling so the latest message is visible.
        NOTE: This is not really best practice... In your rela app, you
        would have this logic in the directive.
    */
    function updateScrolling() {
        // Set the ID of our message log element (textarea) in the HTML.
        var msgLogId = '#messageLog';
        // Get a handle on the element using the querySelector.
        var msgLog = $document[0].querySelector(msgLogId);
        // Set the top of the scroll to the height. This makes the box scroll
        // to the bottom.
        msgLog.scrollTop = msgLog.scrollHeight;
    }

    $scope.sendMessage = function sendMessage(msg) {
		setTimeout( () => {
			ws.send(JSON.stringify({"action": "gyms", "option":"get"}));
			setTimeout( () => {
				 ws.send(JSON.stringify({"action": "gyms", "option":"get"}));
			}, 1000);
		}, 1000);
    };
	
	function getGyms() {
		console.log("getGyms", ws);
		setTimeout( () => {
			ws.send(JSON.stringify({"action": "gyms", "option":"get"}));
			setTimeout( () => {
				 ws.send(JSON.stringify({"action": "gyms", "option":"get"}));
			}, 1000);
		}, 1000);
	}
	
	connect();
})

function deleteItem(item) {
	console.log("Item", item);
	setTimeout( () => {
			ws.send(JSON.stringify({"action": "gyms", "option":"delete", "id": item}));
			setTimeout( () => {
				 ws.send(JSON.stringify({"action": "gyms", "option":"delete", "id": item}));
			}, 1000);
		}, 1000);
};