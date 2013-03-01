define(function(require){

  var apis = {
    webtelephony: {
      name: 'WebTelephony',
      description: 'Allow placing and answering phone calls as well as build in-call UI.',
      info: 'https://wiki.mozilla.org/WebAPI/Security/WebTelephony',
      bugs: [674726],
      isPrepared: function() {
        return ('mozTelephony' in navigator);
      },
    },
    vibration: {
      name: 'Vibration API',
      description: 'Control device vibration for things like haptic feedback in games. Not intended to solve things like vibration for notification.',
      info: 'https://developer.mozilla.org/en-US/docs/DOM/window.navigator.vibrate',
      bugs: [679966],
      isPrepared: function() {
        return ('vibrate' in navigator);
      }
    },
    websms: {
      name: 'WebSMS',
      description: 'Send/receive SMS messages as well as manage messages stored on device.',
      info: 'https://wiki.mozilla.org/WebAPI/WebSMS',
      bugs: [674725],
      isPrepared: function() {
        return ('mozSms' in navigator);
      }
    },
    idle: {
      name: 'Idle API',
      description: 'Get notifications when user is idle.',
      bugs: [715041],
      info: 'https://developer.mozilla.org/en-US/docs/DOM/window.navigator.addIdleObserver',
      isPrepared: function () {
        return ('addIdleObserver' in navigator && 'removeIdleObserver' in navigator);
      }
    },
    screenorientation: {
      name: 'Screen Orientation',
      description: 'Get notification when screen orientation changes as well as control which screen orientation a page/app wants.',
      bugs: [720794, 740188, 673922],
      info: 'https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/deviceorientation',
      isPrepared: function() {
        return ('ondeviceorientation' in window);
      }
    },
    settings: {
      name: 'Settings API',
      description: 'Set system-wide configurations that are saved permanently on the device. ',
      bugs: [678695],
      info: 'https://wiki.mozilla.org/WebAPI/SettingsAPI',
      isPrepared: function() {
        return (!!SettingsManager && !!SettingsLock);
      }
    },
    powermanagement: {
      name: 'Power Management API',
      description: 'Turn on/off screen, cpu, device power, etc. Listen and inspect resource lock events. ',
      bugs: [708964],
      info: 'https://wiki.mozilla.org/WebAPI/PowerManagementAPI',
      isPrepared: function() {
        try {
          return (('mozPower' in navigator) && ('requestWakeLock' in navigator) && (!!PowerManager));
        } catch(e) {
          return false;
        }
      }
    },
    mobileconnection: {
      name: 'Mobile Connection API',
      description: 'Expose signal strength, operator, etc for GSM and other mobile connections. This does not cover WiFi. ',
      bugs: [729173],
      info: 'https://wiki.mozilla.org/WebAPI/WebMobileConnection',
      isPrepared: function() {
        return ('mozMobileConnection' in navigator);
      }
    },

  };

  return apis;
});
