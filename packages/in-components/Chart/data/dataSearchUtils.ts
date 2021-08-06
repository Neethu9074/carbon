/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Axis, Config } from 'in-components/Chart/ResultAwareChart.d';

export function getNearestDataPointDomainForTimestamp(config: Config, timestamp: number, floor = false) {
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

interface DataPoints {
  y1?: [number, number][];
  y2?: [number, number][];
}

export function collectAllDataPointsAtTime(config: Config, timestamp: number) {
  if (timeIsNotDefined(timestamp)) {
    return null;
  }

  const dataPointsCollection: DataPoints = {};
  if (config.y1) {
    for (let i = 0; i < config.y1.metrics.length; i++) {
      const dataSeries = config.y1.metrics[i];
      const dataPointAtTime = getDataPointAtTimeForDataSeries(timestamp, dataSeries);
      if (dataPointAtTime) {
        if (!dataPointsCollection.y1) {
          dataPointsCollection.y1 = [];
        }
        dataPointsCollection.y1[i] = dataPointAtTime;
      }
    }
  }
  if (config.y2) {
    for (let i = 0; i < config.y2.metrics.length; i++) {
      const dataSeries = config.y2.metrics[i];
      const dataPointAtTime = getDataPointAtTimeForDataSeries(timestamp, dataSeries);
      if (dataPointAtTime) {
        if (!dataPointsCollection.y2) {
          dataPointsCollection.y2 = [];
        }
        dataPointsCollection.y2[i] = dataPointAtTime;
      }
    }
  }
  return dataPointsCollection;
}

function getDataPointAtTimeForDataSeries(timestamp: number, dataSeries: [number, number][]) {
  for (let i = 0; i < dataSeries.length; i++) {
    const dataPoint = dataSeries[i];
    if (dataPoint && dataPoint[0] === timestamp) {
      return dataPoint;
    }
  }
  return null;
}

function timeIsNotDefined(timestamp: number) {
  return timestamp == null || timestamp == undefined;
}

export function collectAllDomainValues(config: Config) {
  let allDomainValues = new Set<number>();
  collectAllDomainValuesForAxis(allDomainValues, config.y1);
  collectAllDomainValuesForAxis(allDomainValues, config.y2);
  return Array.from(allDomainValues.keys()).map(n => Number(n));
}

function collectAllDomainValuesForAxis(allDomainValues: Set<number>, axis?: Axis) {
  if (!axis) {
    return;
  }

  for (let iM = 0; iM < axis.metrics.length; iM++) {
    const dataSeries = axis.metrics[iM];
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (dataPoint) {
        allDomainValues.add(dataPoint[0]);
      }
    }
  }
}
