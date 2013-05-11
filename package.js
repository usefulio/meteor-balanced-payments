Package.describe({
	summary: 'Balanced Payments (nbalanced packaged for meteor)'
});

Npm.depends({
	'nbalanced': 'https://github.com/ianserlin/nbalanced/tarball/05eb18cf3536e22b62f349d0520e5df23740dd5c'
});

Package.on_use(function (api) {
	api.add_files('index.js', 'server');
	api.add_files('balanced.js', 'client');
});