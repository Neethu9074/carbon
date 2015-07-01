'use strict';

import 'instana-ui-forge';
import initReact from './react';
import Immutable from 'immutable';

import {
  setActiveMetric,
  clearActiveMetric
} from 'instana-ui-services/stores/metrics';


window.initReact = initReact;

window.performanceCpu = function() {
  setActiveMetric(Immutable.fromJS({
    icon: 'metrics_cpu_usage',
    label: 'Usage',
    longLabel: 'Usage',
    metrics: [
      {name: 'cpu.total.user', label: 'User'},
      {name: 'cpu.total.sys', label: 'System'},
      {name: 'cpu.total.wait', label: 'Wait'},
      {name: 'cpu.total.nice', label: 'Nice'},
      {name: 'cpu.total.steal', label: 'Steal'}
    ]
  }));
};

window.performanceMemory = function() {
  setActiveMetric(Immutable.fromJS({
    icon: 'metrics_memory_free',
    label: 'Free',
    longLabel: 'Memory Free',
    metrics: [{name: 'memory.free', label: 'Memory free'}]
  }));
};

window.performanceLoad = function() {
  setActiveMetric(Immutable.fromJS({
    icon: 'metrics_cpu_load',
    label: 'Load',
    longLabel: 'CPU Load',
    metrics: [{name: 'load.1min', label: 'Load'}]
  }));
};

window.hideMetrics = function() {
  clearActiveMetric();
};
