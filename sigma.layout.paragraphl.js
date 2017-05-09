;(function(undefined) {

  'use strict';

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
    
    var settings = {
      autoArea : true,
      area : 1,
      gravity : 10,
      speed : 0.1,
      iterations : 1000
    };

    this.init = function (sigInst, options) {
      options = options || {};

      // Properties
      this.sigInst = sigInst;
      this.config = sigma.utils.extend(options, settings);

    };

    this.start = function() {
      _eventEmitter[self.sigInst.id].dispatchEvent('start');
      
    };
  };

  // Configuration
  sigma.layouts.paragraphl.configure = function (sigInst, config) {
    if (!sigInst) throw new Error('Missing argument : "sigInst"');
    if (!config) throw new Error('Missing argument : "config"');

    if (!_instance[sigInst.id]) {
      _instance[ingInst.id] = new ParagraphL();
      _eventEmitter[sigInst.id] = {};
      sigma.classes.dispatcher.extend(_eventEmitter[sigInst.id]);

    }

    _instance[sigInst.id].init(sigInst, config);

    return _eventEmitter[sigInst.id];
  };


  // Start the layout algorithm 
  sigma.layouts.paragraphl.start = function(sigInst) {
    if (!sigInst) throw new Error('Missing argument : "sigInst""');
    
    _instance[sigInst.id].start();

    return _eventEmitter[sigInst.id];
  };

  
}).call(this);
