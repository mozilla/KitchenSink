define(function(require){

  var apis = {
    webtelephony: {
      name: 'WebTelephony',
      description: 'Allow placing and answering phone calls as well as build in-call UI.',
      isPrepared: function() {
        return ('mozTelephony' in navigator);
      },
      info: 'https://wiki.mozilla.org/WebAPI/Security/WebTelephony',
      bug: '674726'
    }
  };

  return apis;
});
