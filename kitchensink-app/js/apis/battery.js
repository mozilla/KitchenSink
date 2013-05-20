define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'battery',
    name: 'Battery Status API',
    description: 'Information about battery charge level and if device is plugged in.',
    bugs: [678694],
    info: 'http://dvcs.w3.org/hg/dap/raw-file/tip/battery/Overview.html',
    isPrepared: function() {
      return ('battery' in navigator);
    },
    action: function() {
      var battery = navigator.battery;
      var dischargingTime = battery.dischargingTime;

      if (dischargingTime === Infinity) {
        dischargingTime = 'unknown';
      } else {
        dischargingTime = dischargingTime * 60 + 'min';
      }

      var message = 'Battery Status:\n'
                    + 'discharging time: {dischargingTime}\n'
                    + 'level: {batteryLevel}%\n';

      alert(message.format({
        dischargingTime: dischargingTime,
        batteryLevel: parseInt(battery.level * 100, 10)
      }));
    },
    tests: [
      function(callback) {
        var dischargingTime = navigator.battery.dischargingTime;
        var isValid = (dischargingTime === Infinity || parseInt(dischargingTime, 10));
        callback(!!isValid, 'Battery discharging time', 'check discharging time value');
      },
      function(callback) {
        var level = navigator.battery.level * 100;
        callback(!!parseInt(level, 10), 'Battery level value', 'check level value' + level);
      }
    ]
  });
});
