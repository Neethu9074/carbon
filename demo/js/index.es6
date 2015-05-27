'use strict';

import 'instana-ui-forge';
import initReact from './react';
import eventBus from 'instana-ui-services/eventbus';

window.initReact = initReact;

window.performanceCpu = function() {
  eventBus.emit('showMetrics', {
    metrics: [
      'cpu.total.user.5000.mean',
      'cpu.total.sys.5000.mean',
      'cpu.total.wait.5000.mean',
      'cpu.total.nice.5000.mean',
      'cpu.total.steal.5000.mean'
    ]
  });
};

window.performanceMemory = function() {
  eventBus.emit('showMetrics', {
    metrics: ['memory.free.5000.mean']
  });
};
