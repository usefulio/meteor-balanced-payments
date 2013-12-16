Package.describe({
    summary: 'Balanced Payments (balanced packaged for meteor)'
});

Npm.depends({
    'balanced-official': '0.3.3'
});

Package.on_use(function (api) {
    api.add_files('index.js', 'server');
    api.add_files('balanced.js', 'client');

    api.export('balanced', 'server');
});