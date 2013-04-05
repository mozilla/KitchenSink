define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API ({
    id: 'screenorientation',
    name: 'Screen Orientation',
    description: 'Get notification when screen orientation changes as well as control which screen orientation a page/app wants.',
    bugs: [720794, 740188, 673922],
    info: 'https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/deviceorientation',
    isPrepared: function() {
      return ('ondeviceorientation' in window);
    },
    // TODO: add an ability to test screen orientation as well 
    // https://dvcs.w3.org/hg/screen-orientation/raw-file/tip/Overview.html
    tests: [
      function(callback) {
        var test = 'value of the orientation attribute';

        var callbackListener = function(orientationData) {
          callback(true, test);
          window.removeEventListener('deviceorientation', callbackListener, false);
        };
        window.addEventListener('deviceorientation', callbackListener, false);
      }
    ]
  });
});
