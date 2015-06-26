'use strict';

import 'instana-ui-forge';
import initReact from './react';
import eventBus from 'instana-ui-services/eventbus';
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
    'cpu.total.user',
    'cpu.total.sys',
    'cpu.total.wait',
    'cpu.total.nice',
    'cpu.total.steal'
  ]);
  setActiveMetric(metric);
};

window.performanceMemory = function() {
  const metric = new Immutable.Map().asMutable();
  metric.set('icon', 'metrics_memory_free');
  metric.set('label', 'Memory Free');
  metric.set('longLabel', 'Memory Free');
  metric.set('metrics', ['memory.free']);
  setActiveMetric(metric);
};

window.performanceLoad = function() {
  // select(['load.1min']);
  const metric = new Immutable.Map().asMutable();
  metric.set('icon', 'metrics_cpu_load');
  metric.set('label', 'Load');
  metric.set('longLabel', 'CPU Load');
  metric.set('metrics', ['load.1min']);
  setActiveMetric(metric);
};

window.hideMetrics = function() {
  eventBus.emit('hideMetrics');
  clearActiveMetric();
};
