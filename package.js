Package.describe({
    summary: 'Balanced Payments packaged for meteor'
});

Npm.depends({
    'balanced-official': '1.3.1'
});

Package.on_use(function (api) {
    api.add_files('index.js', 'server');
    api.add_files('balanced.js', 'client');

    api.export('balanced', 'server');
});
