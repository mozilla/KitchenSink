define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'websms',
    name: 'WebSMS',
    description: 'Send/receive SMS messages as well as manage messages stored on device. Non certified apps do have the ability to send SMS via web activities.',
    info: 'https://wiki.mozilla.org/WebAPI/WebSMS',
    bugs: [674725],
    isCertified: true,
    isPrepared: function() {
      return ('mozSms' in navigator);
    }
  });
});
