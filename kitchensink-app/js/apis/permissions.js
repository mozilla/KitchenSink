define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'permissions',
    name: 'Permissions API',
    description: 'Allow Settings app to manage all app permissions in a centralized location',
    bugs: [707625],
    isCertified: true
  });
});
