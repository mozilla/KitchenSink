define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'filehandleapi',
    name: 'FileHandle API',
    description: 'Writable files with locking.',
    bugs: [726593],
    info: 'FileHandle API',
    noPreparation: true,
    tests: [
      function(callback) {
        var test = 'create test file';
        // create myDatabase instance
        // http://people.mozilla.com/~tglek/velocity2012/#/step-16
        var generalErrorHandler = function(event) {
          callback(false, test, 'error callback: ' + event.target.error.name);
        };
        var indexedDB = window.mozIndexedDB || window.indexedDB;
        var idbRequest;
        try {
          idbRequest = indexedDB.open('someDatabase', 1);  
        } catch(e) {
          return callback(false, test, 'opening indexedDB failed');
        }
        idbRequest.onerror = generalErrorHandler;

        idbRequest.onupgradeneeded = function(event) {
          var db = event.target.result;
          var objectStore = db.createObjectStore('files');
        };

        idbRequest.onsuccess = function(event) {
          var myDatabase = event.target.result;
        /*
         * XXX: creating file handle crashes KitchenSinkApp
          var request = myDatabase.mozCreateFileHandle('test.bin', 'binary');
          request.onsuccess = function(event) {
            if ('result' in event.target && event.target.result) {
              log.debug(event.target.result);
              callback(true, test);
            } else {
              callback(false, test, 'no result in event');
            }
          };
          request.onerror = generalErrorHandler;
        */
        };
      }
    ]
  });
});
