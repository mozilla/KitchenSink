define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'archive',
    name: 'Archive API',
    description: 'Read the content of an archive file through DOM File objects.',
    bugs: [772434],
    info: 'https://wiki.mozilla.org/WebAPI/ArchiveAPI',
    isPrepared: function() {
      return ('ArchiveReader' in window);
    }
    // test will download .zip and check if it's fine
  });
});
