Package.describe({
    summary: 'Balanced Payments (balanced packaged for meteor)'
});

Npm.depends({
    'balanced': 'https://codeload.github.com/balanced/balanced-node/legacy.tar.gz/8910da7b59e1ed5a5bfa82a62b1104125b0056e4'
});

Package.on_use(function (api) {
    api.use('sync-methods', 'server');

    api.add_files('index.js', 'server');
    api.add_files('balanced.js', 'client');

    api.export('balanced', 'server');
});