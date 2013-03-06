define(function(require){

  var log = require('logger');
  var apis = {
    webtelephony: {
      name: 'WebTelephony',
      description: 'Allow placing and answering phone calls as well as build in-call UI.',
      info: 'https://wiki.mozilla.org/WebAPI/Security/WebTelephony',
      bugs: [674726],
      isCertified: true,
      isPrepared: function() {
        return ('mozTelephony' in navigator);
      },
      // this can be tested in certified apps only
    },

    vibration: {
      name: 'Vibration API',
      description: 'Control device vibration for things like haptic feedback in games. Not intended to solve things like vibration for notification.',
      info: 'https://developer.mozilla.org/en-US/docs/DOM/window.navigator.vibrate',
      bugs: [679966],
      isPrepared: function() {
        return ('vibrate' in navigator);
      },
      action: function() {
        navigator.vibrate(300);
      }
    },

    websms: {
      name: 'WebSMS',
      description: 'Send/receive SMS messages as well as manage messages stored on device.',
      info: 'https://wiki.mozilla.org/WebAPI/WebSMS',
      bugs: [674725],
      isCertified: true,
      isPrepared: function() {
        return ('mozSms' in navigator);
      }
      // this can be tested in certified apps only
    },

    idle: {
      name: 'Idle API',
      description: 'Get notifications when user is idle.',
      bugs: [715041],
      isCertified: true,
      info: 'https://developer.mozilla.org/en-US/docs/DOM/window.navigator.addIdleObserver',
      isPrepared: function () {
        return ('addIdleObserver' in navigator && 'removeIdleObserver' in navigator);
      }
      // this can be tested in certified apps only
    },

    screenorientation: {
      name: 'Screen Orientation',
      description: 'Get notification when screen orientation changes as well as control which screen orientation a page/app wants.',
      bugs: [720794, 740188, 673922],
      info: 'https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/deviceorientation',
      isPrepared: function() {
        return ('ondeviceorientation' in window);
      },
      tests: [
        function(callback) {
          var id = 'screenorientation',
              name = 'Screen Orientation',
              test = 'value of the orientation attribute';

          var callbackListener = function(orientData) {
            callback(true, id, name, test);
            window.removeEventListener('deviceorientation', callbackListener, false);
          };
          window.addEventListener('deviceorientation', callbackListener, false);
        }
      ]
    },

    settings: {
      name: 'Settings API',
      description: 'Set system-wide configurations that are saved permanently on the device. ',
      bugs: [678695],
      isCertified: true,
      info: 'https://wiki.mozilla.org/WebAPI/SettingsAPI',
      isPrepared: function() {
        return ('SettingsManager' in window && 'SettingsLock' in window);
      },
      
      // this can be tested in certified apps only
      
      tests: [
        function(callback) {
          var id = 'settings',
              name = 'Settings API',
              test = 'SettingsManager is not empty';

          for (key in window.SettingsManager) {
            callback(true, id, name, test); 
          }
          callback(false, id, name, test, 'no key found in object');
        }
      ]
    },

    powermanagement: {
      name: 'Power Management API',
      description: 'Turn on/off screen, cpu, device power, etc. Listen and inspect resource lock events. ',
      bugs: [708964],
      isCertified: true,
      info: 'https://wiki.mozilla.org/WebAPI/PowerManagementAPI',
      isPrepared: function() {
        return (('mozPower' in navigator) && ('requestWakeLock' in navigator));
      }
      // this can be tested in certified apps only
    },

    mobileconnection: {
      name: 'Mobile Connection API',
      description: 'Expose signal strength, operator, etc for GSM and other mobile connections. This does not cover WiFi. ',
      bugs: [729173],
      isCertified: true,
      info: 'https://wiki.mozilla.org/WebAPI/WebMobileConnection',
      isPrepared: function() {
        return ('mozMobileConnection' in navigator);
      }
      // this can be tested in certified apps only
    },

    tcpsocket: {
      name: 'TCP Socket API',
      description: 'Low-level TCP socket API. Will also include SSL support.',
      bugs: [733573],
      isPrepared: function() {
        return ('TCPSocket' in window);
      },
      /* TODO:
      tests: [
        function(callback) {
          var id = 'settings',
              name = 'Settings API',
              test = 'SettingsManager is not empty';

        }
      ]
      */
    },

    geolocation: {
      name: 'Geolocation API',
      description: 'Same API since Firefox 3.5',
      isPrepared: function() {
        return ('geolocation' in navigator && 'getCurrentPosition' in navigator.geolocation);
      },
      // XXX: for some reason getCurrentPosition is failing (timeout). 
      //      Action and test is workin on desktop Firefox, but not on Unagi 
      //      please confirm.
      action: function() {
          var displayLocation = function(position) {
            log.strip(position.coords);

          };
          navigator.geolocation.getCurrentPosition(displayLocation);
      },
      tests: [
        function(callback) {
          var id = 'geolocation',
              name = 'Geolocation API',
              test = '';

          navigator.geolocation.getCurrentPosition(
              function(position) {
                if ('coords' in position) {
                  return callback(true, id, name, test);
                }
                callback(false, id, name, test, 'wrong response in callback');
              }, 
              function() {
                callback(false, id, name, test, 'errorCallback called');
              }, {timeout: 2000});
        }
      ] 
    },

    wifiinfo: {
      name: 'WiFi Information API',
      description: ' 	Privileged API to get a list of available WiFi networks. Also get signal strength and name of currently connected network, etc.',
      info: 'https://wiki.mozilla.org/WebAPI/Security/Wifi',
      // XXX: App is closing down on this test
      // isPrepared: function() {
      //   return ('mozWifiManager' in navigator);
      // }
    },

    devicestorage: {
      name: 'Device Storage API',
      description: 'Add/Read/Modify files stored on a central location on the device. For example the "pictures" folder on modern desktop platforms or the photo storage in mobile devices.',
      bugs: [717103],
      info: 'https://wiki.mozilla.org/WebAPI/Security/DeviceStorage',
      isPrepared: function() {
        return ('getDeviceStorage' in navigator);
      },
      tests: [
        function(callback) {
          var id = 'devicestorage',
              name = 'Device Storage API',
              test = 'create and delete';

          try {
            var storage = navigator.getDeviceStorage('sdcard');
          } catch (e) {
            return callback(false, id, name, test, 'error in getDeviceStorage');
          }
          var blobData = new Blob(['<p>Hello World</p>'], 
                                  { "type" : "text\/xml" });
          try {
            var addResponse = storage.addNamed(blobData, 'filename');
          } catch(e) {
            return callback(false, id, name, test, 'error in add file');
          }
          addResponse.onsuccess = function(response) {
            try {
              var delResponse = storage.delete('filename');
            } catch (e) {
              callback(false, id, name, test, 'error in delete');
            }
            delResponse.onsuccess = function() {
              callback(true, id, name, test);
            }
            delResponse.onerror = function(response) {
              callback(false, id, name, test, 'callbackError in add file');
            };
          };
          addResponse.onerror = function(response) {
            callback(false, id, name, test, 'callbackError in add file');
          };
        }
      ]
    },

    contacts: {
      name: 'Contacts API',
      description: 'Add/Read/Modify the device contacts address book.',
      bugs: [674720],
      info: 'https://wiki.mozilla.org/WebAPI/ContactsAPI',
      isPrepared: function() {
        return ('mozContacts' in navigator);
      },
      tests: [
        function(callback) {
          var id = 'contacts',
              name = 'Contacts API',
              test = '';

          var contact = new mozContact();
          contact.init({name: "Tom"}); // Bug 723206
          var addRequest = navigator.mozContacts.save(contact);
          addRequest.onsuccess = function() {
            var delRequest = navigator.mozContacts.remove(contact);
            delRequest.onsuccess = function() {
              callback(true, id, name, test);
            };
            delRequest.onerror = function() {
              callback(false, id, name, test, 'remove contact failed');
            };
          };
          addRequest.onerror = function() {
            callback(false, id, name, test, 'create contact failed');
          };
        }
      ]
    },

    openwebapps: {
      name: 'Open WebApps',
      description: 'Install web apps and manage installed webapps. Also allows an installed webapp to get payment information. Everything needed to build a Open WebApps app store.',
      bugs: [697006],
      info: 'https://developer.mozilla.org/en/OpenWebApps/The_JavaScript_API',
      isPrepared: function() {
        return ('mozApps' in navigator && 'mgmt' in navigator.mozApps);
      }
    },

    bluetooth: {
      name: 'WebBluetooth',
      description: 'Low level access to Bluetooth hardware.',
      bugs: [674737],
      info: 'https://wiki.mozilla.org/WebAPI/WebBluetooth',
      isPrepared: function() {
        return ('mozBluetooth' in navigator);
      }
    },

    networkinfo: {
      name: 'Network Information API',
      description: 'Get basic information about current network connectivity. Example: "How fast of a connection do I have?".',
      bugs: [677166, 713199],
      info: ' http://dvcs.w3.org/hg/dap/raw-file/tip/network-api/Overview.html',
      isPrepared: function() {
        return ('mozConnection' in navigator);
      }
    },

    battery: {
      name: 'Battery Status API',
      description: 'Information about battery charge level and if device is plugged in.',
      bugs: [678694],
      info: 'http://dvcs.w3.org/hg/dap/raw-file/tip/battery/Overview.html',
      isPrepared: function() {
        return ('battery' in navigator);
      }
    },

    alarm: {
      name: 'Alarm API',
      description: 'Schedule a notification, or for an application to be started, at a specific time.',
      bugs: [749551],
      info: 'https://wiki.mozilla.org/WebAPI/AlarmAPI',
      isPrepared: function() {
        return ('mozAlarms' in navigator);
      }
    },

    browser: {
      name: 'Browser API',
      description: 'Enables implementing a browser completely in web technologies.',
      bugs: [693515],
      info: 'https://wiki.mozilla.org/WebAPI/BrowserAPI',
      isPrepared: function() {
        return ('browser' in navigator);
      }
    },

    timeclock: {
      name: 'Time/Clock API ',
      description: 'Set current time. Timezone will go in the Settings API.',
      bugs: [714357, 714358],
      isPrepared: function() {
        return ('mozTime' in navigator);
      }
    },

    activities: {
      name: 'Web Activities',
      description: 'Delegate an activity to another application.',
      bugs: [715814, 776027],
      info: 'https://wiki.mozilla.org/WebAPI/WebActivities',
      isPrepared: function() {
        return ('registerActivityHandler' in navigator);
      }
    },

    pushnotifications: {
      name: 'Push Notifications API',
      description: 'Allow the platform to send notification messages to specific applications.',
      bugs: [747907],
      info: 'https://wiki.mozilla.org/WebAPI/PushAPI',
      isPrepared: function() {
        return ('mozPush' in navigator);
      }
    },

    permissions: {
      name: 'Permissions API',
      description: 'Allow Settings app to manage all app permissions in a centralized location',
      bugs: [707625],
    },

    webfm: {
      name: 'WebFM API',
      description: 'For FM radio feature.',
      bugs: [749053],
      info: 'https://groups.google.com/forum/?fromgroups#!topic/mozilla.dev.webapi/PraULCQntqA',
      isPrepared: function() {
        return (('mozFM' in navigator) || ('mozFMRadio' in navigator)); 
      }
    },

    filehandleapi: {
      name: 'FileHandle API',
      description: 'Writable files with locking.',
      bugs: [726593],
      info: 'FileHandle API',
      noPreparation: true,
    },

    networkstats: {
      name: 'Network Stats API',
      description: 'Monitor data usage and expose data to privileged apps',
      bugs: [746069],
      isPrepared: function() {
        return ('mozNetworkStats' in navigator);
      }
    },

    webpaymentapi: {
      name: 'WebPayment',
      description: 'Allow Open Web Apps to initiative payments and refunds for virtual goods.',
      bugs: [767818],
      info: 'https://wiki.mozilla.org/WebAPI/WebPayment',
      isPrepared: function() {
        return ('mozPay' in navigator);
      }
    },

    indexeddb: {
      name: 'IndexedDB',
      description: 'Client-side storage of structured data and high performance searches on this data',
      bugs: [553412],
      info: 'http://www.w3.org/TR/IndexedDB/',
      isPrepared: function() {
        return ('mozIndexedDB' in window);
      }
    },

    archive: {
      name: 'Archive API',
      description: 'Blob support for Zip file contents',
      bugs: [772434],
      info: 'https://wiki.mozilla.org/WebAPI/ArchiveAPI',
      isPrepared: function() {
        return ('ArchiveReader' in window);
      }
    },

    ambientlight: {
      name: 'Ambient light sensor',
      description: 'Device light sensor support',
      bugs: [738465],
      info: 'http://www.w3.org/TR/ambient-light/',
    },

    proximity: {
      name: 'Proximity sensor',
      description: 'Device proximity sensor support',
      bugs: [738131],
      info: 'http://www.w3.org/TR/2012/WD-proximity-20120712/',
    },

    cors: {
      name: 'CORS Xhr',
      description: "",
      bugs: [],
      info: "",
      noPreparation: true,
      tests: [
        function (callback) {
          var id = 'cors',
              name = 'CORS Xhr',
              test = '';

          var req = new XMLHttpRequest();
          req.open('GET', 'http://example.com', true);
          req.onload = function() {
            if (req.responseText) {
                callback(true, id, name, test);
            } else {
                callback(false, id, name, test, 'no responseText');
            }
          };
          req.onerror = req.onabort = function(e) {
            callback(false, id, name, test, e.type + ' in response');
          };
          try {
            req.send();
          } catch(e) {
            callback(false, id, name, test, e.type + ' in send');
          }
        }
      ],
    },

    systemxhr: {
      name: 'System Xhr',
      description: "",
      bugs: [],
      info: "",
      noPreparation: true,
      tests: [
        function(callback) {
          var id = 'systemxhr',
              name = 'System Xhr',
              test = '';

          var req = new XMLHttpRequest({
              mozSystem: true,
              mozAnon: true
          });
          req.open('GET',
                   'http://maps.googleapis.com/maps/api/geocode/json?address=Castro+Str,+Mountain+View,+CA&sensor=false', true);
          req.onload = function() {
            var resp = req.responseText;
            try {
              resp = JSON.parse(resp);
            } catch(e) {}
            if (resp) {
              callback(true, id, name, test);
            } else {
              callback(false, id, name, test, 'no response');
            }
          };
          req.onerror = req.onabort = function(e) {
            callback(false, id, name, test, e.type + ' in response');
          };
          try {
            req.send();
          } catch(e) {
            callback(false, id, name, test, e.type + ' in send');
          }
        }
      ],
    }
  };

  return apis;
});
