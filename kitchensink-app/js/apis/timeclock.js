define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'timeclock',
    name: 'Time/Clock API ',
    description: 'Set current time. Timezone will go in the Settings API.',
    bugs: [714357, 714358],
    isPrepared: function() {
      // accessing mozTime is stopping the app even if in try/catch block
      // try {
      //   log.debug(navigator.mozTime);
      // } catch(e) {
      //   log.strip(e);
      // }
      return ('mozTime' in navigator);
    }
  });
});
