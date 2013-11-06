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

License
=======

MIT