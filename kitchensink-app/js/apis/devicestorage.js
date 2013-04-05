define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'devicestorage',
    name: 'Device Storage (sdcard)',
    description: 'Add/Read/Modify files stored on a central location on the device. For example the "pictures" folder on modern desktop platforms or the photo storage in mobile devices.',
    bugs: [717103],
    info: 'https://developer.mozilla.org/en-US/docs/WebAPI/Device_Storage',
    isPrepared: function() {
      return ('getDeviceStorage' in navigator);
    },
    tests: [
      function(callback) {
        var test = 'create and delete';

        var storage;
        try {
          storage = navigator.getDeviceStorage('sdcard');
        } catch (e) {
          return callback(false, test, 'error in getDeviceStorage');
        }
        var blobData = new Blob(['<p>Hello World</p>'], 
                                {'type' : 'text/xml'});
        var addResponse;
        try {
          addResponse = storage.addNamed(blobData, 'filename');
        } catch(e) {
          return callback(false, test, 'error in add file');
        }
        addResponse.onsuccess = function(response) {
          var deleteResponse;
          try {
            deleteResponse = storage.delete('filename');
          } catch (e) {
            callback(false, test, 'error in delete');
          }
          deleteResponse.onsuccess = function() {
            callback(true, test);
          };
          deleteResponse.onerror = function(response) {
            callback(false, test, 'callbackError in add file');
          };
        };
        addResponse.onerror = function(response) {
          callback(false, test, 'callbackError in add file');
        };
      }
    ]
  });
});
