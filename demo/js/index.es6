'use strict';

import 'instana-ui-forge';
import initReact from './react';
import eventBus from 'instana-ui-services/eventbus';

window.initReact = initReact;

window.performanceCpu = function() {
  eventBus.emit('showMetrics', {
    metrics: [
      'cpu.total.user',
      'cpu.total.sys',
      'cpu.total.wait',
      'cpu.total.nice',
      'cpu.total.steal'
    ]
  });
};

window.performanceMemory = function() {
  eventBus.emit('showMetrics', {
    metrics: ['memory.free']
  });
};

window.performanceLoad = function() {
  eventBus.emit('showMetrics', {
    metrics: ['load.1min']
  });
};

window.hideMetrics = function() {
  eventBus.emit('hideMetrics');
};
