define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'indexeddb',
    name: 'IndexedDB',
    description: 'Client-side storage of structured data and high performance searches on this data',
    bugs: [553412],
    info: 'http://www.w3.org/TR/IndexedDB/',
    isPrepared: function() {
      return ('mozIndexedDB' in window || 'indexedDB' in window);
    },
    tests: [
      function(callback) {
        // TODO: fix that
        var test = 'add and remove data from indexeddb';

        var generalErrorHandler = function(event) {
          callback(false, test, 'error callback: ' + event.target.error.name);
        };
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        var idbRequest;
        try {
          idbRequest = indexedDB.open('someDatabase', 1);  
        } catch(e) {
          return callback(false, test, 'opening indexedDB failed');
        }
        idbRequest.onerror = generalErrorHandler;

        idbRequest.onupgradeneeded = function(event) {
          var db = event.target.result;
          var objectStore = db.createObjectStore('someData', {keyPath: 'someKey'});
        };

        idbRequest.onsuccess = function(event) {
          var db = event.target.result;
          // XXX: DEBUG - throws after this command
          // from Firefox:
          // [09:46:44.704] NotFoundError: The operation failed because the 
          // requested database object could not be found. For example, an 
          // object store did not exist but was being opened. 
          var transaction = db.transaction(['someData'], 'readwrite');
          transaction.onerror = generalErrorHandler;

          var objectStore = transaction.objectStore('someData');
          var addRequest = objectStore.add({someKey: 'a key', someValue: 'a value'});
          addRequest.onerror = generalErrorHandler;

          addRequest.onsuccess = function(event) {
            if (event.target.result !== 'a key') {
              callback(false, test, 'wrong key added');
            }
            removeRequest = objectStore.delete('a key');
            removeRequest.onerror = generalErrorHandler;

            removeRequest.onsuccess = function() {
              callback(true, test);
            };
          };
        };
      }
    ]
  });
});
