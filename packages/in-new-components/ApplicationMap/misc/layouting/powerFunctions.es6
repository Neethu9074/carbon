import { emptyArray } from 'in-services/fixedObjects';

export default function getPowerFunctions(incomingConnectionsMap) {
  const nodes = new Map();

  let maxCalls = 0;
  let minCalls = Number.MAX_VALUE;
  let maxLatency = 0;
  let minLatency = Number.MAX_VALUE;
  let maxErrorRate = 0;
  let minErrorRate = Number.MAX_VALUE;

  let serviceIds = incomingConnectionsMap.keys();
  for (const serviceId of serviceIds) {
    const incomingConnections = incomingConnectionsMap.get(serviceId) || emptyArray;

    const totalCalls = incomingConnections.reduce((a, b) => a + b.calls, 0);
    const serviceMaxLatency = incomingConnections.reduce((a, b) => Math.max(a, b.latency), 0);
    const serviceMaxErrorRate = incomingConnections.reduce((a, b) => Math.max(a, b.errorRate), 0);

    nodes.set(serviceId, { totalCalls, serviceMaxLatency, serviceMaxErrorRate });

    maxCalls = Math.max(maxCalls, totalCalls);
    minCalls = Math.min(minCalls, totalCalls);
    maxLatency = Math.max(maxLatency, serviceMaxLatency);
    minLatency = Math.min(minLatency, serviceMaxLatency);
    maxErrorRate = Math.max(maxErrorRate, serviceMaxErrorRate);
    minErrorRate = Math.min(minErrorRate, serviceMaxErrorRate);
  }

  serviceIds = nodes.keys();
  for (const serviceId of serviceIds) {
    const node = nodes.get(serviceId);

    node.callsPower = get(minCalls, maxCalls, node.totalCalls);
    node.serviceLatencyPower = get(minLatency, maxLatency, node.serviceMaxLatency);
    node.errorRatePower = get(minErrorRate, maxErrorRate, node.serviceMaxErrorRate);
    nodes.set(serviceId, node);
  }

  function get(min, max, value) {
    if (min === max) {
      return 0;
    }
    return (value - min) / (max - min);
  }
  function getMetric(id, metric) {
    if (!nodes.has(id)) {
      return 0;
    }
    return nodes.get(id)[metric];
  }

  return {
    getPowerByName: (serviceId, sizeMetric, defaultValue) => {
      if (sizeMetric === 'calls') {
        return getMetric(serviceId, 'callsPower');
      }
      if (sizeMetric === 'latency') {
        return getMetric(serviceId, 'serviceLatencyPower');
      }
      if (sizeMetric === 'errorRate') {
        return getMetric(serviceId, 'errorRatePower');
      }
      return defaultValue;
    },
    getMetricByName: (serviceId, sizeMetric) => {
      if (sizeMetric === 'calls') {
        return getMetric(serviceId, 'totalCalls');
      }
      if (sizeMetric === 'latency') {
        return getMetric(serviceId, 'serviceMaxLatency');
      }
      if (sizeMetric === 'errorRate') {
        return getMetric(serviceId, 'serviceMaxErrorRate');
      }
    }
  };
}
