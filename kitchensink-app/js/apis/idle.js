define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'idle',
    name: 'Idle API',
    description: 'Get notifications when user is idle' ,
    bugs: [715041],
    isCertified: true,
    info: 'https://developer.mozilla.org/en-US/docs/DOM/window.navigator.addIdleObserver',
    isPrepared: function () {
      return ('addIdleObserver' in navigator && 'removeIdleObserver' in navigator);
    }
  });
});
