define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'webtelephony',
    name: 'WebTelephony',
    description: 'Allow placing and answering phone calls as well as build in-call UI. Non certified apps do have the ability to send SMS via web activities.',
    info: 'https://wiki.mozilla.org/WebAPI/Security/WebTelephony',
    bugs: [674726],
    isCertified: true,
    isPrepared: function() {
      return ('mozTelephony' in navigator);
    }
  });
});
