define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'webpaymentapi',
    name: 'WebPayment',
    description: 'Allow Open Web Apps to initiate payments and refunds for virtual goods.',
    bugs: [767818],
    info: 'https://wiki.mozilla.org/WebAPI/WebPayment',
    isPrepared: function() {
      return ('mozPay' in navigator);
    }
  });
});
