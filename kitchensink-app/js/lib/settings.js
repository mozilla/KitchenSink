define(function(require) {
  var prime = require('prime');
  var Emitter = require('prime/emitter');
  var $ = require('elements');
  require('elements/events');
  require('elements/attributes');
  require('elements/traversal');
  
  var Settings = prime({
    inherits: Emitter,

    options: {
      certifiedVisible: {
        // do not display certified apps by default
        value: false,
        // update setting from element
        updateFrom: 'certifiedVisible',
        isBoolean: true
      },
      sendResults: {
        // do not send results to the server by default
        value: false,
        // update setting from element
        updateFrom: 'sendResults',
        isBoolean: true
      },
      deviceModel: {
        value: null
        // TODO: find a way or decide if to get models from server
      },
      phoneResourceUri: {
        value: null
      },
      collectionServer: {
        value: 'http://127.0.0.1:8093'
      }
    },

    constructor: function() {
      // update settings from localStorage
      var localSettings = JSON.parse(localStorage.settings || '{}');
      for (var key in localSettings) {
        if (key in this.options) {
          this.options[key].value = localSettings[key];
        }
      } 
      this.store();
      this.updateElements();
    },

    get: function(key) {
      return this.options[key].value;
    },

    set: function(key, value) {
      this.options[key].value = value;
      this.store();
      this.emit(key);
    },

    store: function() {
      var values = {};
      for (var key in this.options) {
        values[key] = this.options[key].value;
      }
      localStorage.settings = JSON.stringify(values);
    },

    /**
     * update current state of elements 
     */
    updateElements: function() {
      var self = this;
      function setCheckbox() {
        self.set(this.key, this.checked());
      }
      function setInput() {
        self.set(this.key, this.value);
      }
      for (var key in this.options) {
        var item = this.options[key];
        if (item.updateFrom) {
          var element = $('#' + item.updateFrom);
          element.key = key;
          if (item.isBoolean) {
            if (item.value) {
              element.check();
            } else {
              element.uncheck();
            }
            element.on('change', setCheckbox);
          } else {
            element.value = item.value;
            element.on('change', setInput);
          }
        }
      }
    }
  });

  return new Settings();
});
