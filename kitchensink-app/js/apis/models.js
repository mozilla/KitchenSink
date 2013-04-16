/*
 * Definitions of the KitchenSink models
 */

define(function(require) {
  var prime = require('prime');
  var $ = require('elements');
  var zen = require('elements/zen');
  var log = require('logger');
  var elements = require('utils').elements;

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
                   + '<dd class="hidden box">'
                   + '<p>{description}</p>'
                   + '</dd>';
      elements(itemHTML.format(this)).insert(parentEl);
      this.apiElement = $('#' + this.id);
      // create a hook to the API object in the DOM element
      this.apiElement._model = this;
      this.contentElement = this.apiElement.nextSibling();
      var descriptionElement = this.contentElement.find('p');
      if (this.isCertified) {
        elements('<span class="certified">{certified}</span>'.format(signs)).insert(this.apiElement);
        this.apiElement.addClass('certified');
      }
      this.apiElement.on('click', this.toggle.bind(this));
      if (this.info) {
        elements(' <a class="info" href="{info}">More info...</a>'.format(this)).insert(descriptionElement);
      }
      // assign action to onclick event
      if (this.action) {
        this.apiElement.addClass('action');
        var actionElement = elements('<button>RUN</button>').top(this.contentElement);
        actionElement.on('click', this.action.bind(this));
      }
      if (this.bugs.length > 0) {
        var bugsElement = elements('<ul class="bugs"></ul>').insert(this.contentElement);
        var bugHTML = '<li><a href="https://bugzilla.mozilla.org/show_bug.cgi?id={bug}">{bug}</a></li>';
        this.bugs.forEach(function(bugNumber) {
          elements(bugHTML.format({bug: bugNumber})).insert(bugsElement);
        });
      }
      // wrap dd content to create a nice looking dropshadow
      // http://www.456bereastreet.com/archive/201304/responsive_drop_shadows/
      var wrap = zen('div.box-content');
      this.contentElement.children().insert(wrap);
      wrap.insert(this.contentElement);
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
      this.contentElement.addClass('hidden');
      this.apiElement.removeClass('open');
    },

    show: function() {
      // hideAll if full featured accordion is needed
      this.contentElement.removeClass('hidden');
      this.apiElement.addClass('open');
    },

    /*
     * Test if DOM contains objects needed for API to work
     */
    testPreparation: function() {
      if (this.checkPreparation) {
        this.prepared = this.isPrepared();
        elements(
          '<span class="{successClass}">{preparedSign}</span>'.format({
            successClass: (this.prepared ? 'success' : 'fail'),
            preparedSign: (this.prepared ? signs.prepared : signs.notprepared)
          })
        ).insert(this.apiElement);
        this.apiElement.addClass((this.prepared ? 'success' : 'fail')); 
        if (!this.prepared && this.tests) {
          log.debug(this.name + ' is not prepared (tests not run)', this.contentElement);
        }
      } else if (!this.noPreparation) {
        // it should be prepared but no isPrepared method
        elements('<span class="notest">{nopreparation}</span>'.format(signs)).insert(this.apiElement);
        this.apiElement.addClass('notest');
        log.error('No test for ' + this.name, this.contentElement);
      } else {
        this.prepared = true;
      }
    },

    runTests: function() {
      var self = this;

      // callback for the tests
      var showResult = function(result, testName, message) {
        elements(
          '<span class="{successClass}">{successSign}</span>'.format({
            successClass: (result ? 'success' : 'fail'),
            successSign: (result ? signs.success : signs.fail) 
          })
        ).insert(self.apiElement);
        self.apiElement.addClass((result ? 'success' : 'fail')); 
        if (!result) {
          var response = self.name + '.';
          if (testName) {
            response += testName;
            if (message) {
              response += ': ' + message;
            }
          }
          log.error(response, self.contentElement);
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
