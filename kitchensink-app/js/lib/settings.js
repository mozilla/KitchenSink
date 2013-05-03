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
      }
    },

    constructor: function() {
      // update settings from localStorage
      var localSettings = JSON.parse(localStorage.settings || '{}');
      for (var key in localSettings) {
        this.options[key].value = localSettings[key];
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
      for (var key in this.options) {
        var item = this.options[key];
        if (item.updateFrom) {
          var element = $('#' + item.updateFrom);
          if (item.isBoolean) {
            if (item.value) {
              element.check();
            } else {
              element.uncheck();
            }
            // hook to change event
            element.on('change', function() {
              self.set(key, this.checked());
            });
          } else {
            element.value = item.value;
            // hook to change event
            element.on('change', function() {
              self.set(key, this.value);
            });
          }
        }
      }
    },

  });

  return new Settings();
});
