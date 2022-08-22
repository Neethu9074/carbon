/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Axis, MetricDataSeries } from 'in-components/Chart/types';
import Configuration from 'in-components/Chart/Configuration';

export function getNearestDataPointDomainForTimestamp(config: Configuration, timestamp: number, floor = false) {
  if (timeIsNotDefined(timestamp)) {
    return null;
  }

  const allDomainValues = config.getAllDomainValues?.() ?? [];
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

export const AxisNames = ['y1', 'y2'] as const;
export type AxisName = typeof AxisNames[number];

type DataPoints = {
  y1?: [number, number][];
  y2?: [number, number][];
};

function collectDataPointsForAxis(
  axisName: AxisName,
  metricDataSeries: MetricDataSeries[] | undefined,
  timestamp: number,
  dataPointsCollection: DataPoints
) {
  if (metricDataSeries == null) {
    return;
  }
  for (let i = 0; i < metricDataSeries.length; i++) {
    const dataSeries = metricDataSeries[i];
    const dataPointAtTime = getDataPointAtTimeForDataSeries(timestamp, dataSeries);
    if (dataPointAtTime) {
      if (!dataPointsCollection[axisName]) {
        dataPointsCollection[axisName] = [];
      }
      // We previously created an empty array if the axis is not yet present, so we are sure it exists
      dataPointsCollection[axisName]![i] = dataPointAtTime;
    }
  }
}

export function collectAllDataPointsAtTime(config: Configuration, timestamp: number) {
  if (timeIsNotDefined(timestamp)) {
    return null;
  }

  const dataPointsCollection: DataPoints = {};
  for (const axis of AxisNames) {
    if (config[axis]) {
      collectDataPointsForAxis(axis, config[axis]?.metrics, timestamp, dataPointsCollection);
    }
  }
  return dataPointsCollection;
}

export function collectAllCompanionDataPointsAtTime(config: Configuration, timestamp: number) {
  if (timeIsNotDefined(timestamp)) {
    return null;
  }

  const dataPointsCollection: DataPoints = {};
  for (const axis of AxisNames) {
    if (config[axis] && config[axis]?.companionMetrics) {
      collectDataPointsForAxis(axis, config[axis]?.companionMetrics, timestamp, dataPointsCollection);
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

export function collectAllDomainValues(config: Configuration) {
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
