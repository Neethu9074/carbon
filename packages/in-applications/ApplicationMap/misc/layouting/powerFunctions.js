/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { emptyArray } from 'in-services/fixedObjects';

export default function getPowerFunctions(incomingConnectionsMap) {
  const nodes = new Map();

  let minMax = {
    calls: {
      max: 0,
      min: Number.MAX_VALUE
    },
    latency: {
      max: 0,
      min: Number.MAX_VALUE
    },
    errorRate: {
      max: 0,
      min: Number.MAX_VALUE
    }
  };

  let serviceIds = incomingConnectionsMap.keys();
  for (const serviceId of serviceIds) {
    const incomingConnections = incomingConnectionsMap.get(serviceId) || emptyArray;

    const totalCalls = incomingConnections.reduce((a, b) => a + b.calls, 0);
    const serviceMaxLatency = incomingConnections.reduce((a, b) => Math.max(a, b.latency), 0);
    const serviceMaxErrorRate = incomingConnections.reduce((a, b) => Math.max(a, b.errorRate), 0);

    nodes.set(serviceId, { totalCalls, serviceMaxLatency, serviceMaxErrorRate });

    minMax.calls.max = Math.max(minMax.calls.max, totalCalls);
    minMax.calls.min = Math.min(minMax.calls.min, totalCalls);
    minMax.latency.max = Math.max(minMax.latency.max, serviceMaxLatency);
    minMax.latency.min = Math.min(minMax.latency.min, serviceMaxLatency);
    minMax.errorRate.max = Math.max(minMax.errorRate.max, serviceMaxErrorRate);
    minMax.errorRate.min = Math.min(minMax.errorRate.min, serviceMaxErrorRate);
  }

  // If no calls/errors/latency is registered, the minimum value may stay at MAX, therefore resetting to 0.
  if (minMax.calls.min === Number.MAX_VALUE) {
    minMax.calls.min = 0;
  }
  if (minMax.latency.min === Number.MAX_VALUE) {
    minMax.latency.min = 0;
  }
  if (minMax.errorRate.min === Number.MAX_VALUE) {
    minMax.errorRate.min = 0;
  }

  serviceIds = nodes.keys();
  for (const serviceId of serviceIds) {
    const node = nodes.get(serviceId);

    node.calls = get(minMax.calls.min, minMax.calls.max, node.totalCalls);
    node.latency = get(minMax.latency.min, minMax.latency.max, node.serviceMaxLatency);
    node.errorRate = get(minMax.errorRate.min, minMax.errorRate.max, node.serviceMaxErrorRate);
    nodes.set(serviceId, node);
  }

  function get(min, max, value) {
    if (min === max) {
      return 0;
    }
    return (value - min) / (max - min);
  }

  return {
    getPowerByName: (serviceId, sizeMetric, defaultValue = 0) => {
      if (!sizeMetric || !nodes.has(serviceId)) {
        return defaultValue;
      }
      return nodes.get(serviceId)[sizeMetric];
    },
    getMinMetricValueByName: sizeMetric => minMax[sizeMetric].min,
    getMaxMetricValueByName: sizeMetric => minMax[sizeMetric].max
  };
}
