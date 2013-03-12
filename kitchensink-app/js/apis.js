define(function(require){

  var $ = require('zepto');
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
        /* Check if onDeviceOrientation event is working
         */
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
      tests: [
        /* 
         * Check if SettingsManager isn't empty for privileged app
         */
        function(callback) {
          var id = 'settings',
              name = 'Settings API',
              test = 'SettingsManager is empty';

          for (key in window.SettingsManager) {
            return callback(false, id, name, test, 'keys found in object'); 
          }
          callback(true, id, name, test);
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
          var id = 'tcpsocket',
              name = 'TCP Socket API',
              test = '';

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
      name: 'Device Storage (sdcard)',
      description: 'Add/Read/Modify files stored on a central location on the device. For example the "pictures" folder on modern desktop platforms or the photo storage in mobile devices.',
      bugs: [717103],
      info: 'https://wiki.mozilla.org/WebAPI/Security/DeviceStorage',
      isPrepared: function() {
        return ('getDeviceStorage' in navigator);
      },
      tests: [
        function(callback) {
          var id = 'devicestorage',
              name = 'Device Storage (scdard)',
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
        return ('mozContacts' in navigator && navigator.mozContacts);
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
      },
      tests: [
        function(callback) {
          var id = 'openwebapps',
              name = 'Open WebApps',
              test = '';

          try {
            var request = navigator.mozApps.getSelf();
          } catch(e) {
            return callback(false, id, name, test, 'error in getSelf');
          }
          request.onsuccess = function() {
            try {
              if (request.result.manifest.name) {
                callback(true, id, name, test);
              } else {
                callback(false, id, name, test, 'no name returned');
              }
            } catch(e) {
              callback(false, id, name, test, 'error in retrieving name');
            }
          };
          request.onerror = function() {
            callback(false, id, name, test, 'errorCallback called');// request.error.name);
          };
        }
      ]
    },

    bluetooth: {
      name: 'WebBluetooth',
      description: 'Low level access to Bluetooth hardware.',
      bugs: [674737],
      isCertified: true,
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
        return ('mozConnection' in navigator && (navigator.mozConnection.metered === true || navigator.mozConnection.metered === false));
      },
      action: function() {
        var message = "Network Info:\nmetered: " 
                      + navigator.mozConnection.metered
                      + '\nbandwith: ';
        var bandwidth = navigator.mozConnection.bandwidth;
        if (bandwidth === 0) {
          message += 'offline';
        } else if (bandwidth === Infinity) {
          message += 'unknown';
        } else {
          message += bandwidth + 'MB/s';
        }
        alert(message);
      }
    },

    battery: {
      name: 'Battery Status API',
      description: 'Information about battery charge level and if device is plugged in.',
      bugs: [678694],
      info: 'http://dvcs.w3.org/hg/dap/raw-file/tip/battery/Overview.html',
      isPrepared: function() {
        return ('battery' in navigator);
      },
      action: function() {
        var battery = navigator.battery;
        var dischargingTime = battery.dischargingTime;
        if (dischargingTime === Infinity) {
          dischargingTime = 'unknown';
        } else {
          dischargingTime = dischargingTime * 60 + 'min';
        }
        var message = 'Battery Status:\n'
                      + 'discharging time: ' + dischargingTime + '\n'
                      + 'level: ' + parseInt(battery.level * 100) + '%\n';
        alert(message);
      },
      tests: [
        function(callback) {
          var dischargingTime = navigator.battery.dischargingTime;
          var isValid = (dischargingTime === Infinity || parseInt(dischargingTime));
          callback(!!isValid, 'battery', 'Battery Status API', 'check discharging time value');
        },
        function(callback) {
          var level = navigator.battery.level * 100;
          callback(!!parseInt(level), 'battery', 'Battery Status API', 'check level value', level);
        }
      ]
    },

    alarm: {
      name: 'Alarm API',
      description: 'Schedule a notification, or for an application to be started, at a specific time.',
      bugs: [749551],
      info: 'https://wiki.mozilla.org/WebAPI/AlarmAPI',
      isPrepared: function() {
        return ('mozAlarms' in navigator && navigator.mozAlarms);
      },
      tests: [
        function(callback) {
          var id = 'alarm',
              name = 'Alarm API',
              test = 'add/remove alarms';

          var today = new Date();
          var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
          var alarmId1;
          // add new alarm
          var addRequest = navigator.mozAlarms.add(tomorrow, 'ignoreTimezone', 
                                              {mydata: 'bar'});
          addRequest.onsuccess = function(e) {
            // assign alarm to alarmId1
            alarmId1 = e.target.result;
            // get All
            var getRequest = navigator.mozAlarms.getAll();
            getRequest.onsuccess = function(e) {
              // check if alarmId1 is added
              var found = false;
              e.target.result.forEach(function(item) {
                if (item.id == alarmId1) {
                  found = true;
                }
              });
              if (!found) {
                return callback(false, id, name, test, 'alarm not found');
              }
              // delete alarmId1
              navigator.mozAlarms.remove(alarmId1);
              // check if removed
              var secGetRequest = navigator.mozAlarms.getAll();
              secGetRequest.onsuccess = function(e) {
                // check if alarmId1 is added
                var found = false;
                e.target.result.forEach(function(item) {
                  if (item.id == alarmId1.id) {
                    found = true;
                  }
                });
                if (found) {
                  return callback(false, id, name, test, 'alarm still exists');
                }
                callback(true, id, name, test);
              }
            };
            getRequest.onerror = function(e) {
              callback(false, id, name, test, 'errorCallback called in getAll');
            };
          };
          addRequest.onerror = function (e) {
            callback(false, id, name, test, 'errorCallback called on add');
          };
        }
      ]
    },

    browser: {
      name: 'Browser API',
      description: 'Enables implementing a browser completely in web technologies.',
      bugs: [693515],
      info: 'https://wiki.mozilla.org/WebAPI/BrowserAPI',
      noPreparation: true,
      tests: [
        function(callback) {
          var id = 'browser',
              name = 'Browser API',
              test = 'methods present in browser tag';
          var failed = false;
          var fail = [];
          var methods = ['stop', 'reload', 'go', 'getScreenShot'];
          $('body').append('<browser id="testBrowser">');
          var browser = $('#testBrowser');

          methods.forEach(function(method) {
            if (!(method in browser)) {
              failed = true;
              fail.push(method);
            }
          });
          callback(!failed, id, name, test, fail.join(', '));
          browser.remove();
        }
      ]
    },

    timeclock: {
      name: 'Time/Clock API ',
      description: 'Set current time. Timezone will go in the Settings API.',
      bugs: [714357, 714358],
      isPrepared: function() {
        // accessing mozTime is stopping the app even if in try/catch block
        // try {
        //   log.debug(navigator.mozTime);
        // } catch(e) {
        //   log.strip(e);
        // }
        return ('mozTime' in navigator);
      }
    },

    activities: {
      name: 'Web Activities',
      description: 'Delegate an activity to another application.',
      bugs: [715814, 776027],
      info: 'https://wiki.mozilla.org/WebAPI/WebActivities',
      isPrepared: function() {
        return ('MozActivity' in window);
      },
      tests: [
        /* TODO: find a way to not call activity on test
        function(callback) {
          var id = 'activities',
              name = 'Web Activities',
              test = 'listeners defined in new Activity';
          try {
            var activ = new MozActivity({ 
              name: "pick", data: { type: "image/png", multiple: false }});
          } catch(e) {
            return callback(false, id, name, test, 'error: ' + e);
          }
          var isValid = ('onsuccess' in active && 'onerror' in active);
          callback(isValid, id, name, test);
        }
         */
      ]
    },

    pushnotifications: {
      name: 'Push Notifications API',
      description: 'Allow the platform to send notification messages to specific applications.',
      bugs: [747907],
      info: 'https://wiki.mozilla.org/WebAPI/PushAPI',
      isPrepared: function() {
        return ('mozPush' in navigator || 'push' in navigator);
      }
    },

    permissions: {
      name: 'Permissions API',
      description: 'Allow Settings app to manage all app permissions in a centralized location',
      bugs: [707625],
      isCertified: true
    },

    webfm: {
      name: 'WebFM API',
      description: 'For FM radio feature.',
      bugs: [749053],
      info: 'https://groups.google.com/forum/?fromgroups#!topic/mozilla.dev.webapi/PraULCQntqA',
      isPrepared: function() {
        return (('mozFM' in navigator) || ('mozFMRadio' in navigator)); 
      },
      action: function() {
        var radio = navigator.mozFMRadio;
        log.debug(radio);
        radio.enable(96.7);
        var seekRequest = radio.seekUp();
        seekRequest.onsuccess = function(e) {
          log.debug(e.target.result);
        }
        seekRequest.onerror = function() {
          log.debug('seek failed');
        }
        var message = 'Webradio:\n'
                      + (radio.enabled ? 'enabled' : 'disabled') + '\n'
                      + 'antenna: ' + radio.antennaAvailable + '\n'
                      + 'frequency: ' + radio.frequency;
        alert(message);
        radio.disable(); 
      }
    },

    filehandleapi: {
      name: 'FileHandle API',
      description: 'Writable files with locking.',
      bugs: [726593],
      info: 'FileHandle API',
      noPreparation: true,
      tests: [
        function(callback) {
          var id = 'filehandleapi',
              name = 'FileHandle API',
              test = 'create test file';
          // create myDatabase instance
          // http://people.mozilla.com/~tglek/velocity2012/#/step-16
          var general_idb_error_handler = function(event) {
            callback(false, id, name, test, 
                     'error callback: ' + event.target.error.name);
          }
          var indexedDB = window.mozIndexedDB || window.indexedDB
          try {
            var idbrequest = indexedDB.open("someDatabase", 1);  
          } catch(e) {
            return callback(false, id, name, test, 'opening indexedDB failed');
          }
          idbrequest.onerror = general_idb_error_handler;

          idbrequest.onupgradeneeded = function(event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore("files");
          }

          idbrequest.onsuccess = function(event) {
            var myDatabase = event.target.result;
            var request = {};
          /*
           * XXX: this crashes KitchenSinkApp
            var request = myDatabase.mozCreateFileHandle("test.bin", "binary");
          */
            request.onsuccess = function(event) {
              if ('result' in event.target && event.target.result) {
                log.debug(event.target.result);
                callback(true, id, name, test);
              } else {
                callback(false, id, name, test, 'no result in event');
              }
            };
            request.onerror = general_idb_error_handler;
          }
        }
      ]
    },

    networkstats: {
      name: 'Network Stats API',
      description: 'Monitor data usage and expose data to privileged apps',
      bugs: [746069],
      isCertified: true,
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
      },
      tests: [
        function(callback) {
          // TODO: fix that
          var id = 'indexeddb',
              name = 'IndexedDB',
              test = '';

          var general_error_handler = function(event) {
            
            callback(false, id, name, test, 
                     'error callback: ' + event.target.error.name);
          }
          var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
          try {
            var idbrequest = indexedDB.open('someDatabase', 1);  
          } catch(e) {
            return callback(false, id, name, test, 'opening indexedDB failed');
          }
          idbrequest.onerror = general_error_handler;

          idbrequest.onupgradeneeded = function(event) {
            log.debig('-111');
            var db = event.target.result;
            var objectStore = db.createObjectStore('someData', {keyPath: 'someKey'});
          }

          idbrequest.onsuccess = function(event) {
            log.debug('000');
            var db = event.target.result;
            log.debug(db);
            var transaction = db.transaction(['someData'], 'readwrite');
            log.debug(transaction);
            transaction.onerror = general_error_handler;
            var objectStore = transaction.objectStore('someData');
            log.debug(objectStore);
            var addRequest = objectStore.add({someKey: 'a key', someValue: 'a value'});
            addRequest.onerror = general_error_handler;
            addRequest.onsuccess = function(event) {
              log.debug('111');
              if (event.target.result !== 'a key') {
                callback(false, id, name, test, 'wrong key added');
              }
              delRequest = objectStore.delete('a key');
              delRequest.onerror = general_error_handler;
              delRequest.onsuccess = function() {
                callback(true, id, name, test);
              }
            }
          }
        }
      ]
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
              callback(false, id, name, test, 'no response. Is device connected to the internet?');
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
