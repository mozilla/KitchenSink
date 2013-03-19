define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'networkinfo',
    name: 'Network Information API',
    description: 'Get basic information about current network connectivity. Example: "How fast of a connection do I have?"',
    bugs: [677166, 713199],
    info: ' http://dvcs.w3.org/hg/dap/raw-file/tip/network-api/Overview.html',
    isPrepared: function() {
      return ('mozConnection' in navigator && (navigator.mozConnection.metered === true || navigator.mozConnection.metered === false));
    },
    action: function() {
      var bandwidth = navigator.mozConnection.bandwidth;
      var bandwidthInfo;

      if (bandwidth === 0) {
        bandwidthInfo = 'offline';
      } else if (bandwidth === Infinity) {
        bandwidthInfo = 'unknown';
      } else {
        bandwidthInfo = bandwidth + 'MB/s';
      }

      var message = 'Network Info:\n'
                    + 'metered: {metered}\n'
                    + 'bandwith: {bandwidthInfo}';

      alert(message.format({ 
        metered: navigator.mozConnection.metered, 
        bandwidthInfo: bandwidthInfo
      }));
    }
  });
});
