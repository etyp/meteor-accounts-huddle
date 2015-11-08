Package.describe({
  name: 'typ:accounts-huddle',
  summary: 'OAuth2 integration with Huddle',
  version: '0.0.1',
  git: 'https://github.com/typ90/meteor-accounts-huddle'
});

Package.onUse(function(api) {
    api.versionsFrom('0.9.4');
    api.use('accounts-base', ['client', 'server']);
    api.use('service-configuration', ['client', 'server']);
    // Export Accounts (etc) to packages using this one.
    api.imply('accounts-base', ['client', 'server']);
    api.imply('service-configuration', ['client', 'server']);
    api.use('accounts-oauth', ['client', 'server']);
    api.use('oauth2', ['client', 'server']);
    api.use('oauth', ['client', 'server']);
    api.use('http', ['server']);
    api.use(['underscore', 'service-configuration'], ['client', 'server']);
    api.use(['random', 'templating'], 'client');

    api.export('Huddle');

    api.addFiles(['huddle_configure.html', 'huddle_configure.js'],'client');
    api.addFiles('huddle_server.js', 'server');
    api.addFiles('huddle_client.js', 'client');
    api.addFiles('huddle.js', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('typ:accounts-huddle');

  api.addFiles('huddle-tests.js');
});
