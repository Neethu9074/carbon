'use strict';

import 'instana-ui-forge';
import initReact from './react';
import eventBus from 'instana-ui-services/eventbus';

window.initReact = initReact;

window.performanceOn = function() {
  eventBus.emit('showMetricsOn');
};

window.performanceOff = function() {
  eventBus.emit('showMetricsOff');
};

window.performanceCpu = function() {
  eventBus.emit('showMetrics', {
    metrics: [
      'cpu.user.5000.mean',
      'cpu.system.5000.mean',
      'cpu.io.5000.mean',
      'cpu.steal.5000.mean',
      'cpu.nice.5000.mean'
    ]
  });
};

window.performanceMemory = function() {
  eventBus.emit('showMetrics', {
    metrics: ['memory.free.5000.mean']
  });
};
