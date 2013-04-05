define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'networkstats',
    name: 'Network Stats API',
    description: 'Monitor data usage and expose data to privileged apps.',
    bugs: [746069],
    isCertified: true,
    isPrepared: function() {
      return ('mozNetworkStats' in navigator);
    }
  });
});
