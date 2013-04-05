define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'settings',
    name: 'Settings API',
    description: 'Set system-wide configurations that are saved permanently on the device. ',
    bugs: [678695],
    isCertified: true,
    info: 'https://wiki.mozilla.org/WebAPI/SettingsAPI',
    isPrepared: function() {
      return ('SettingsManager' in window && 'SettingsLock' in window);
    },
    // tests: [
    //   /* 
    //    * Check if SettingsManager isn't empty for privileged app
    //    */
    //   function(callback) {
    //     var test = 'SettingsManager is empty';

    //     if (Object.keys(window.SettingsManager).length > 0) {
    //       return callback(false, test, 'keys found in object'); 
    //     }
    //     callback(true, test);
    //   }
    // ]
  });
});
