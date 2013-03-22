define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'contacts',
    name: 'Contacts API',
    description: 'Add/Read/Modify the device contacts address book.',
    bugs: [674720],
    info: 'https://wiki.mozilla.org/WebAPI/ContactsAPI',
    isPrepared: function() {
      return ('mozContacts' in navigator);
    },
    tests: [
      function(callback) {
        var test = 'create and remove a contact';

        if (navigator.mozContacts) {
          var contact = new mozContact();
          contact.init({name: 'Tom'}); // Bug 723206
          var addRequest = navigator.mozContacts.save(contact);
          addRequest.onsuccess = function() {
            var removeRequest = navigator.mozContacts.remove(contact);
            removeRequest.onsuccess = function() {
              callback(true, test);
            };
            removeRequest.onerror = function() {
              callback(false, test, 'remove contact failed');
            };
          };
          addRequest.onerror = function() {
            callback(false, test, 'create contact failed');
          };
        } else {
          callback(false, test, 'navigator.MozContacts is falsy');
        }
      }
    ]
  });
});
