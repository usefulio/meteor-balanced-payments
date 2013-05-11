Meteor.startup(function(){
	Session.set('balancedLoaded', false);
	
	//Functions to run after the script tag has loaded
	var balancedLoadCallback = function(){
		Session.set('balancedLoaded', true);
	};

	//If the script doesn't load
	var balancedErrorCallback = function(error){
	    if(typeof console != undefined) {
	        console.log(error);
	    }
	};

	//Generate a script tag
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://js.balancedpayments.com/v1/balanced.js';
	script.onload = balancedLoadCallback;
	script.onerror = balancedErrorCallback;

	//Load the script tag
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(script);
});