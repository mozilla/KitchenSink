define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'powermanagement',
    name: 'Power Management API',
    description: 'Turn on/off screen, cpu, device power, etc. Listen and inspect resource lock events.',
    bugs: [708964],
    isCertified: true,
    info: 'https://wiki.mozilla.org/WebAPI/PowerManagementAPI',
    isPrepared: function() {
      return ('mozPower' in navigator && 'requestWakeLock' in navigator);
    }
  });
});
