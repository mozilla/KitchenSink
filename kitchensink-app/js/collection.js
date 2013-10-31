define(function(require) {
  var settings = require('settings');
  var prime = require('prime');
  var Emitter = require('prime/emitter');

  /**
   * Helper class to provide CORS requests
   * TODO: make it more generic and move to lib directory
   */
  var CORSRequest = prime({
    inherits: Emitter,

    constructor: function(method, url, data, callback) {
      var self = this;

      this.request = new XMLHttpRequest({
        mozSystem: true,
        mozAnon: true
      });
    
      this.method = method.toUpperCase();

      if (data) {
        this.data = JSON.stringify(data);
      } else {
        // empty string is not valid for tastypie
        this.data = '{}';
      }

      this.request.open(this.method, url + '?format=json');
      this.request.setRequestHeader('Content-type', 'application/json');
      this.request.setRequestHeader('X-PINGOTHER', 'pingpong');

      this.request.onload = function() {
        if (self.request.status === 404 ||
            self.request.status === 500) {
          self.emit('error', this.request.status);
          return;
        }
        self.emit('success', this.responseText); 
      };

      this.request.onerror = function(e) {
        self.emit('error', self.request.status);
      };

      if (callback) {
        this.send(callback);
      }
    },

    send: function(callback) {
      this.on('success', callback);
      this.request.send(this.data);
    }
  });

  var Collection = prime({
    inherits: Emitter,
    collectionServer: settings.get('collectionServer'),
    apiPrefix: '/api/v1',

    constructor: function() {
      var self = this;
      this.on('ready', function() {
        self.ready = true;
      });

      // this array will be empty after all data retrieved
      var allCallbacks = ['phone', 'app_version'];

      if ('lastCollectedData' in localStorage) {
        this.lastCollectedData = localStorage.lastCollectedData;
      }

      this.setPhoneResourceUri(function() {
        delete allCallbacks[allCallbacks.indexOf('phone')];
        if (!allCallbacks) {
          this.emit('ready');
        }
      });

      // get app_version
      var request = window.navigator.mozApps.getSelf();
      request.onsuccess = function() {
        delete allCallbacks[allCallbacks.indexOf('app_version')];
        if (request.result) {
          self.appVersion = request.result.manifest.version;
        } else {
          self.appVersion = 0;
        }
        if (allCallbacks.length === 0) {
          this.emit('ready');
        }
      };
    },

    /**
     * returns app id stored in localStorage or retrieves one from
     * collection server
     */
    getPhoneResourceUri: function(callback) {
      var self = this;
      if (settings.get('phoneResourceUri')) {
        callback(settings.get('phoneResourceUri'));
        return;
      }
      if (!settings.get('sendResults')) {
        callback(undefined);
        return;
      }
      // retrieve phoneResourceUri from collection server
      new CORSRequest('post', this.collectionServer + this.apiPrefix + '/phone/', 
          {}, function getPhoneResourceUriCallback(responseText) {
            var data = JSON.parse(responseText);
            callback(data.resource_uri);
          }
      );
    },

    /**
     * sets phoneResourceUri
     */
    setPhoneResourceUri: function(callback) {
      var self = this;
      this.getPhoneResourceUri(function(phoneResourceUri) {
        if (phoneResourceUri) {
          settings.set('phoneResourceUri', phoneResourceUri);
        }
        callback(phoneResourceUri);
      });
    },

    /**
     * prepares an object to be send to collection server
     */
    getFullData: function(currentResults) {
      return {
        test_result: JSON.stringify(currentResults),
        device: settings.get('deviceModel'),
        phone: settings.get('phoneResourceUri'),
        app_version: this.appVersion,
        user_agent: navigator.userAgent
      };
    },

    /**
     * send results to collection server
     *
     * param results: object containing all tests for supported APIs
     */
    sendResults: function(results) {
      var self = this;
      if (!settings.get('sendResults')) {
        return;
      }
      if (settings.get('phoneResourceUri')) {
        this._realSendResults(results);
      } else {
        this.setPhoneResourceUri(function() {
          self._realSendResults(results);
        });
      }
    },

    _realSendResults: function(results) {
      if (!settings.get('phoneResourceUri')) {
        // it should never happened if called via sendResults
        return;
      }
      var data = this.getFullData(results);
      if (!diffLastResults(data)) {
         return;
       }
      new CORSRequest('post', 
          this.collectionServer + this.apiPrefix + '/result/', 
          data, function() {
            // TODO: add the success failure
            localStorage.collectedData = JSON.stringify(data);
          }
      );
    }
  });

  /** 
   * Compare last results sent to current results
   * returns null if no difference
   */
  function diffLastResults(currentData) {
    if (!localStorage.collectedData) {
      return true;
    }
    var collectedData = JSON.parse(localStorage.collectedData);
    // compare currentData to collectedData 
    // tests are stored as JSON string - thee will need to be parsed
    // seoarately for each API
   
    if (collectedData.device !== currentData.device ||
        collectedData.app_version !== currentData.app_version ||
        collectedData.phone !== currentData.phone ||
        collectedData.user_agent !== currentData.user_agent) {
      return true;
    } 

    // compare test results
    var collectedResults = JSON.parse(collectedData.test_result);
    var currentResults = JSON.parse(currentData.test_result);
    // check if number of APIs is the same
    if (Object.keys(collectedData).length !== Object.keys(currentData).length) {
      return true;
    }
    for (var apiId in currentResults) {
      // check diff for each API
      var current = currentResults[apiId];
      if (!(apiId in collectedResults)) {
        return true;
      }
      var collected = collectedResults[apiId];
      if (collected.preparation !== current.preparation ||
          Object.keys(current.tests).length !== Object.keys(collected.tests).length) {
        return true;
      }
      for (var testName in current.tests) {
        // check each test in API
        if (!(testName in collected.tests) ||
            current.tests[testName] !== collected.tests[testName]) {
          return true;
        }
      }
    }
    // collectedData and currentData are the same
    return false;
  }


  return new Collection();
});
