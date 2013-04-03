define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'alarm',
    name: 'Alarm API',
    description: 'Schedule a notification, or for an application to be started, at a specific time.',
    bugs: [749551],
    info: 'https://developer.mozilla.org/docs/WebAPI/Alarm',
    isPrepared: function() {
      return ('mozAlarms' in navigator && navigator.mozAlarms);
    },
    tests: [
      function(callback) {
        var test = 'add/remove alarms';

        var today = new Date();
        var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
        var alarmId1;
        // add new alarm
        var addRequest = navigator.mozAlarms.add(tomorrow, 'ignoreTimezone', 
                                                 {mydata: 'bar'});
        addRequest.onsuccess = function(e) {
          // assign alarm to alarmId1
          alarmId1 = e.target.result;

          // get All
          var getRequest = navigator.mozAlarms.getAll();
          getRequest.onsuccess = function(e) {
            // check if alarmId1 is added
            var found = false;
            e.target.result.forEach(function(item) {
              if (item.id === alarmId1) {
                found = true;
              }
            });
            if (!found) {
              return callback(false, test, 'alarm not found');
            }

            // delete alarmId1 (synchronous)
            navigator.mozAlarms.remove(alarmId1);

            // check if removed
            var secGetRequest = navigator.mozAlarms.getAll();
            secGetRequest.onsuccess = function(e) {
              // check if alarmId1 is added
              var found = false;
              e.target.result.forEach(function(item) {
                if (item.id === alarmId1) {
                  found = true;
                }
              });
              if (found) {
                return callback(false, test, 'alarm still exists');
              }
              callback(true, test);
            };
          };

          getRequest.onerror = function(e) {
            callback(false, test, 'errorCallback called in getAll');
          };
        };

        addRequest.onerror = function (e) {
          callback(false, test, 'errorCallback called on add');
        };
      }
    ]
  });
});
