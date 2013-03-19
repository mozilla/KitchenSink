define(function(require) {
  require('string'); // modifies String prototype

  var apis = [
    require('./webtelephony'),
    require('./vibration'),
    require('./websms'),
    require('./idle'),
    require('./screenorientation'),
    require('./settings'),
    require('./powermanagement'),
    require('./mobileconnection'),
    require('./tcpsocket'),
    require('./geolocation'),
    require('./wifiinfo'),
    require('./devicestorage'),
    require('./contacts'),
    require('./openwebapps'),
    require('./bluetooth'),
    require('./networkinfo'),
    require('./battery'),
    require('./alarm'),
    require('./browser'),
    require('./timeclock'),
    require('./activities'),
    require('./pushnotifications'),
    require('./permissions'),
    require('./webfm'),
    require('./filehandleapi'),
    require('./networkstats'),
    require('./webpaymentapi'),
    require('./indexeddb'),
    require('./archive'),
    require('./ambientlight'),
    require('./proximity'),
    require('./cors'),
    require('./systemxhr')
  ];

  return apis;
});
