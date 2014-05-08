Balanced Payments API
=====================

This package encapsulates the official balanced nodejs client for interacting with the Balanced Payments API from your server. See usage information here:

https://github.com/balanced/balanced-node

It also adds the balanced.js client to your client code.

How to install
==============

`mrt add balanced-payments`

You will need Meteor _0.6.5+_ for this library to work.

How to use
==========

When the balanced.js file has loaded, it will `Session.set('balancedLoaded', true)`.
I suggest using the `session-extras` package and taking advantage of `Session.whenTrue` to handle this case, because when it is loaded you will need to initialize balanced.js on your client with your api key:

```js
balanced.init(':your_marketplace_uri');
```

On the server, check out the https://github.com/balanced/balanced-node documentation, but basically `balanced` will become a globally available function that you initialize by doing:

```js
balanced = new balanced({
	secret: BALANCED_API_SECRET
	, marketplace_uri: MARKETPLACE_URI
});
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