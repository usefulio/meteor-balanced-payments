Balanced Payments API
=====================

This package encapsulates the official balanced nodejs client for interacting with the Balanced Payments API from your server and adds the balanced.js client to your client code.  This package now supports version 1.1 of the Balanced Payments API.

See usage information here:

https://github.com/balanced/balanced-node

How to install
==============

`mrt add balanced-payments`

You will need Meteor _0.6.5+_ for this library to work.

How to use
==========

Client side:

When the balanced.js file has loaded, it will set a session variable with `Session.set('balancedLoaded', true)`.  You can use the optional `session-extras` package to detect when this file is fully loaded and the `balanced` object is available for use.

Note that prior versions of balanced.js file required the client to initialize balanced.js with your marketplace api key before making any other calls.  This is no longer required.  You can simply use the `balanced` object when needed.


Server side:

Refer to https://github.com/balanced/balanced-node for full documentation, but basically `balanced` will become a globally available object that you can use for all calls.  The structure has changed significantly from the prior version and will require many changes to your code.  Some API calls, return values, etc., have changed.  This version also uses the 'q' promises async package as opposed to the callback interface used previously, so you will need to use something like Meteor's included Futures package to collect output values and return inside Meteor methods.  The following is one possible pattern for using the asynchonous promise-based API within server side code that is synchronous (e.g., Meteor methods).

```js
balanced.configure('balanced-api-secret-key');

var fut = new Future();

balanced.marketplace.customers.create({ ... })
  // other promise based API calls can be made here using the output of create() 
  .then(function(result) {
      // other processing can happen here
      fut['return'](result);
  })
  .catch(function (err) {
      fut['throw'](err);
  });

var ret;
try {
  ret = fut.wait();
  console.log("after wait() call, return value is ", ret.toJSON());
} catch(err) {
  // something in create() or any then() calls above threw an exception
  console.log("after wait() in catch() ...");
}
```

Example
=======

`payments.js` on the server

```
payments = new balanced({
	secret: Meteor.settings.balanced.apiSecret
	, marketplace_uri: Meteor.settings.balanced.marketplaceUri
});

Meteor.syncMethods({
	addCreditCard: function(card, cb){
		var userId = this.userId
			, user = Meteor.users.findOne(userId)
			, customer = payments.Customers.balanced(user.balanced);

		console.log('adding card', card);

		customer.Customers.addCard(user.balanced.uri, card.uri, generateBalancedCustomerUpdateCallback(userId, cb, 'balanced add card'));
	}
	, addBankAccount: function(bankAccount, cb){
		var userId = this.userId
			, user = Meteor.users.findOne(userId)
			, customer = payments.Customers.balanced(user.balanced);

		console.log('adding bank account', bankAccount);

		customer.Customers.addBankAccount(user.balanced.uri, bankAccount.uri, generateBalancedCustomerUpdateCallback(userId, cb, 'balanced add bank account'));
	}
	, updateBalancedCustomer: function(data, cb){
		var userId = this.userId
			, user = Meteor.users.findOne(userId)
			, customer = payments.Customers.balanced(user.balanced);

		_.extend(user.balanced, data);

		console.log('updating balanced customer', user.balanced);

		customer.Customers.update(user.balanced, generateBalancedCustomerUpdateCallback(userId, cb, 'updating balanced customer'));
	}
	, getDefaultPaymentMethod: function(cb){
		var user = Meteor.users.findOne(this.userId)
			, cardId = user.balanced && user.balanced.source_uri ? user.balanced.source_uri.split('/')[5] : null;

		if(cardId){
			// shitty hack b/c customer support is shitty in balanced
			payments.Cards.get('/cards/'+cardId, function(err, response){
				cb(err, {
					brand: response.brand
					, last_four: response.last_four
					, name: response.name
				});
			});
		}else{
			cb(new Meteor.Error(404, 'You do not have a current funding source.'));
		}
	}
	, getDefaultPayoutMethod: function(cb){
		var user = Meteor.users.findOne(this.userId)
			, bankAccountId = user.balanced && user.balanced.destination_uri ? user.balanced.destination_uri.split('/')[5] : null;

		if(bankAccountId){
			// shitty hack b/c customer support is shitty in balanced
			payments.BankAccounts.get('/bank_accounts/'+bankAccountId, function(err, response){
				cb(err, {
					name: response.name
					, bankName: response.bank_name
					, accountNumber: response.account_number
					, type: response.type
				});
			});
		}else{
			cb(new Meteor.Error(404, 'You do not have a current funding source.'));
		}
	}
});

function generateBalancedCustomerUpdateCallback(userId, cb, msg){
	return Meteor.bindEnvironment(
		function generatedBalancedCustomerUpdateCallback(err, balancedResponse){
			console.log('balanced response', balancedResponse);
			if(err){
				console.error(msg, err);
				cb(err);
			}else{
				var underwritten = !_.isNull(balancedResponse.business_name) && !_.isNull(balancedResponse.ein) && !_.isNull(balancedResponse.phone);
				Meteor.users.update({ _id: userId}, {
					$set: { 
						balanced: balancedResponse
						, underwritten: underwritten
						, hasFundingSource: !_.isNull(balancedResponse.source_uri)
						, hasFundingDestination: !_.isNull(balancedResponse.destination_uri)
					}
				}, function(err){
					if(err){
						console.log(msg, err);
					}
					cb(err);
				})
			}
	}, function(err){
		console.log('exception caught by bind env', err);
		console.error(err);
		cb(err);
	});
}
```

License
=======

MIT