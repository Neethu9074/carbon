/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function getNearestDataPointDomainForTimestamp(config, timestamp, floor = false) {
  if (timeIsNotDefined(timestamp)) {
    return null;
  }

  const allDomainValues = config.getAllDomainValues();
  let domainValues = allDomainValues;
  if (floor) {
    domainValues = allDomainValues.filter(domain => domain <= timestamp);
  }
  let distanceToNearestDataPoint = Number.MAX_VALUE;
  let nearestDomain = null;

  for (let i = 0; i < domainValues.length; i++) {
    const domain = domainValues[i];
    const distanceToDataPoint = Math.abs(timestamp - domain);
    if (distanceToDataPoint < distanceToNearestDataPoint) {
      nearestDomain = domain;
      distanceToNearestDataPoint = distanceToDataPoint;
    }
  }

  return nearestDomain;
}

export function collectAllDataPointsAtTime(config, timestamp) {
  if (timeIsNotDefined(timestamp)) {
    return null;
  }

  const dataPointsCollection = {};
  collectAllDataPointsAtTimeForAxis(config, timestamp, 'y1', dataPointsCollection);
  collectAllDataPointsAtTimeForAxis(config, timestamp, 'y2', dataPointsCollection);
  return dataPointsCollection;
}

function collectAllDataPointsAtTimeForAxis(config, timestamp, axisName, dataPointsCollection) {
  const axis = config[axisName];
  if (!axis) {
    return;
  }

  for (let i = 0; i < axis.metrics.length; i++) {
    const dataSeries = axis.metrics[i];
    const dataPointAtTime = getDataPointAtTimeForDataSeries(timestamp, dataSeries);
    if (dataPointAtTime) {
      if (!dataPointsCollection[axisName]) {
        dataPointsCollection[axisName] = [];
      }
      dataPointsCollection[axisName][i] = dataPointAtTime;
    }
  }
}

function getDataPointAtTimeForDataSeries(timestamp, dataSeries) {
  for (let i = 0; i < dataSeries.length; i++) {
    const dataPoint = dataSeries[i];
    if (dataPoint && dataPoint[0] === timestamp) {
      return dataPoint;
    }
  }
}

function timeIsNotDefined(timestamp) {
  return timestamp == null || timestamp == undefined;
}

export function collectAllDomainValues(config) {
  let allDomainValues = {};
  collectAllDomainValuesForAxis(allDomainValues, config.y1);
  collectAllDomainValuesForAxis(allDomainValues, config.y2);
  allDomainValues = Object.keys(allDomainValues).map(n => Number(n));
  return allDomainValues;
}

function collectAllDomainValuesForAxis(allDomainValues, axis) {
  if (!axis) {
    return;
  }

  for (let iM = 0; iM < axis.metrics.length; iM++) {
    const dataSeries = axis.metrics[iM];
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (dataPoint) {
        allDomainValues[dataPoint[0]] = true;
      }
    }
  }
}
