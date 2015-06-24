'use strict';

import 'instana-ui-forge';
import initReact from './react';
import eventBus from 'instana-ui-services/eventbus';

import {select} from 'instana-ui-services/stores/metrics';


window.initReact = initReact;

window.performanceCpu = function() {
  select([
    'cpu.total.user',
    'cpu.total.sys',
    'cpu.total.wait',
    'cpu.total.nice',
    'cpu.total.steal'
  ]);
};

window.performanceMemory = function() {
  select(['memory.free']);
};

window.performanceLoad = function() {
  select(['load.1min']);
};

window.hideMetrics = function() {
  eventBus.emit('hideMetrics');
};
