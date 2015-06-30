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
  const metric = new Immutable.Map().asMutable();
  metric.set('icon', 'metrics_cpu_usage');
  metric.set('label', 'Usage');
  metric.set('longLabel', 'Usage');
  metric.set('metrics', [
    {name: 'cpu.total.user', label: 'User'},
    {name: 'cpu.total.sys', label: 'System'},
    {name: 'cpu.total.wait', label: 'Wait'},
    {name: 'cpu.total.nice', label: 'Nice'},
    {name: 'cpu.total.steal', label: 'Steal'}
  ]);
  setActiveMetric(metric);
};

window.performanceMemory = function() {
  const metric = new Immutable.Map().asMutable();
  metric.set('icon', 'metrics_memory_free');
  metric.set('label', 'Memory Free');
  metric.set('longLabel', 'Memory Free');
  metric.set('metrics', [{name: 'memory.free', label: 'Memory free'}]);
  setActiveMetric(metric);
};

window.performanceLoad = function() {
  // select(['load.1min']);
  const metric = new Immutable.Map().asMutable();
  metric.set('icon', 'metrics_cpu_load');
  metric.set('label', 'Load');
  metric.set('longLabel', 'CPU Load');
  metric.set('metrics', [{name: 'load.1min', label: 'Load'}]);
  setActiveMetric(metric);
};

window.hideMetrics = function() {
  clearActiveMetric();
};
