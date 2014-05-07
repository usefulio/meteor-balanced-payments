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

Note that prior versions of balanced.js file required the client to initialize balanced.js with your marketplace api key before making any other calls.  This is no longer required.


Server side:

Refer to https://github.com/balanced/balanced-node for full documentation, but basically `balanced` will become a globally available object that you can use for all calls.  Note that this has changed significantly from the prior version and will require changes to your code.

```js
balanced.configure('balanced-api-secret-key');

balanced.marketplace.cards.create({ ... });
```

License
=======

MIT