/*
 * Definitions of the KitchenSink models
 */

define(function(require) {
  var prime = require('prime/index');
  var $ = require('zepto');
  //var accordion = require('accordion');
  var log = require('logger');

  // definition of signs to display
  var signs = {
    certified: '[C]',
    prepared: '+',
    notprepared: '-',
    success: '*',
    fail: 'F',
    nopreparation: '?'
  };

  /*
   * defines API class with all its properties and testing functions
   */
  var API = prime({
    // predefined parameters
    description: '',
    info: '',
    bugs: [],
    isCertified: false,
    noPreparation: false,

    /*
     * called when object is created
     * options::
     *    id: (string, no spaces) id of the API - used in DOM
     *    name: (string) 
     *    description: (string)
     *    info: (string) a link to a more info page
     *    bugs: (array) bugzilla bugs numbers
     *    isCertified: (boolean) default false, is the API restricted to certified apps?
     *    noPreparation: (boolean) default false, doesn't DOM need to be prepared?
     *    isPrepared: (function) checks if the DOM is prepared
     *        returns: boolean
     *    action: (function) example usage for this API
     *    tests: (array of functions) actual asynchronous tests 
     *        argument: callback (function)
     *                  needs to be called with result (boolean)
     *                  optionally also test name and a message 
     */
    constructor: function(options) {
      this.setOptions(options);
      this.visible = false;
    },

    setOptions: function(options) {
      if (options === null) {
        options = {};
      }
      for (var key in options) {
        this[key] = options[key];
      }
      // should preparation be checked?
      this.checkPreparation = (!this.noPreparation && this.isPrepared);
      return this;
    },

    /*
     * Create LI element inside parentEl
     * assign ``action`` if provided
     */
    render: function(parentEl) {
      // build the content
      var itemHTML = '<dt id="{id}">{name}</dt>'
                   + '<dd class="hidden">'
                   + '<p>{description}</p>'
                   + '</dd>';
      parentEl.append(itemHTML.format(this));
      this.apiElement = $('#' + this.id);
      this.contentElement = this.apiElement.next();
      var descriptionElement = this.contentElement.find('p');
      if (this.isCertified) {
        this.apiElement.append('<span class="certified">{certified}</span>'.format(signs));
        this.apiElement.addClass('certified');
      }
      this.apiElement.on('click', this.toggle.bind(this));
      if (this.info) {
        descriptionElement.append(' <a class="info" href="{info}">More info...</a>'.format(this));
      }
      // assign action to onclick event
      if (this.action) {
        descriptionElement.before('<button class="action">RUN</button>');
        var actionElement = this.contentElement.find('button');
        actionElement.on('click', this.action.bind(this));
      }
      if (this.bugs.length > 0) {
        this.contentElement.append('<ul class="bugs"></ul>');
        var bugsElement = this.contentElement.find('.bugs');
        this.bugs.forEach(function(bug) {
          bugsElement.append(
            '<li><a href="https://bugzilla.mozilla.org/show_bug.cgi?id={bug}">{bug}'.format({bug: bug})
          );
        });
      }
    },

    toggle: function() {
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
      this.visible = !this.visible;
    },

    hide: function() {
      this.contentElement.hide();
      this.apiElement.removeClass('open');
    },

    show: function() {
      // hideAll if full featured accordion is needed
      this.contentElement.show(120);
      this.apiElement.addClass('open');
    },

    /*
     * Test if DOM contains objects needed for API to work
     */
    testPreparation: function() {
      if (this.checkPreparation) {
        this.prepared = this.isPrepared();
        this.apiElement.append(
          '<span class="{successClass}">{preparedSign}</span>'.format({
            successClass: (this.prepared ? 'success' : 'fail'),
            preparedSign: (this.prepared ? signs.prepared : signs.notprepared)
          })
        );
        if (this.prepared) {
          this.apiElement.addClass('success');
        } else {
          if (this.tests) {
            log.debug(this.name + ' is not prepared (tests not run)');
          }
          this.apiElement.addClass('fail');
        }
      } else if (!this.noPreparation) {
        // it should be prepared but no isPrepared method
        this.apiElement.append('<span class="notest">' + signs.nopreparation + '</span>');
        this.apiElement.addClass('notest');
        log.error('No test for ' + this.name);
      } else {
        this.prepared = true;
      }
    },

    runTests: function() {
      var self = this;

      // callback for the tests
      var showResult = function(result, testName, message) {
        self.apiElement.append(
          '<span class="{successClass}">{successSign}</span>'.format({
            successClass: (result ? 'success' : 'fail'),
            successSign: (result ? signs.success : signs.fail) 
          })
        );
        self.apiElement.addClass((result ? 'success' : 'fail')); 
        if (!result) {
          var response = '[FAIL] ' + self.name + '.';
          if (testName) {
            response += testName;
            if (message) {
              response += ': ' + message;
            }
          }
          log.info(response);
        }
      };
      
      if (this.prepared && this.tests) {
        this.tests.forEach(function(test) {
          test.bind(self)(showResult);
        });
      }
    }
  });

  return {
    API: API
  };
});
