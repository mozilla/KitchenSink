define(function(require) {
  var prime = require('prime');
  var Emitter = require('prime/emitter');
  
  var Settings = prime({
    inherits: Emitter,

    options: {
      'certifiedVisible': false
    },

    constructor: function() {
      // update settings from localStorage
      var localSettings = JSON.parse(localStorage.settings || '{}');
      for (var key in localSettings) {
        this.options[key] = localSettings[key];
      } 
      this.store();
    },

    get: function(key) {
      return this.options[key];
    },

    set: function(key, value) {
      this.options[key] = value;
      this.store();
      this.emit(key);
    },

    store: function() {
      localStorage.settings = JSON.stringify(this.options);
    }

  });

  return new Settings();
});
