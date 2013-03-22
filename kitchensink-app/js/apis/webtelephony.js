define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'webtelephony',
    name: 'WebTelephony',
    description: 'Allow placing and answering phone calls as well as build in-call UI.',
    info: 'https://wiki.mozilla.org/WebAPI/Security/WebTelephony',
    bugs: [674726],
    isCertified: true,
    isPrepared: function() {
      return ('mozTelephony' in navigator);
    }
  });
});
