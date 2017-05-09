;(function(undefined) {

  if (typeof sigma == 'undefined')
    throw new Error('sigma is not declared');

  if (typeof turbojs == 'undefined') {
    throw new Error('turbo is not declared');
  } else {
    console.log('turbo.js installed');
  }

  // Initialize : 
  sigma.utils.pkg('sigma.layouts.paragraphl');

  var _instance = {};

  var _eventEmitter = {};

  function ParagraphL() {
    var self = this;

    // Configuration
    this.init = function (sigInst, options) {

    };

    // Layout algorithm implementation
    this.singleStep = function () {

    };

    // Start the layout algorithm 
    this.start = function() {

    };

  }
  
}).call(this);
