define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'archive',
    name: 'Archive API',
    description: 'Blob support for Zip file contents',
    bugs: [772434],
    info: 'https://wiki.mozilla.org/WebAPI/ArchiveAPI',
    isPrepared: function() {
      return ('ArchiveReader' in window);
    }
    // test will download .zip and check if it's fine
  });
});
