'use strict';

import _ from 'lodash';

// {
//   metric: /^memory\.free/,
//   locator: snapshot => max value
// }
const maxValueLocators = [];
const minValueLocators = [];
const normalizedValueLocators = [];
const formattedValueLocators = [];

export function addMaxValueLocator(metric, locator) {
  maxValueLocators.push({
    metric,
    locator
  });
}

export function addMinValueLocator(metric, locator) {
  minValueLocators.push({
    metric,
    locator
  });
}

export function addNormalizedValueLocator(metric, locator) {
  normalizedValueLocators.push({
    metric,
    locator
  });
}

export function addFormattedValueLocator(metric, locator) {
  formattedValueLocators.push({
    metric,
    locator
  });
}


export function getMaxValue(metric, snapshot) {
  const locator = _.find(
    maxValueLocators,
    eachLocator => metric.match(eachLocator.metric)
  );

  if (!locator) {
    throw new Error('No locator found for metric ' + metric);
  }

  return locator.locator(snapshot, metric.match(locator.metric));
}

export function getMinValue(metric, snapshot) {
  const locator = _.find(
    minValueLocators,
    eachLocator => metric.match(eachLocator.metric)
  );

  if (!locator) {
    throw new Error('No locator found for metric ' + metric);
  }
  return locator.locator(snapshot, metric.match(locator.metric));
}

export function getNormalizedValue(metric, snapshot, value) {
  const locator = _.find(
    normalizedValueLocators,
    eachLocator => metric.match(eachLocator.metric)
  );

  if (!locator) {
    throw new Error('No locator found for metric ' + metric);
  }
  return locator.locator(getMaxValue(metric, snapshot), value);
}

export function getFormattedValue(metric, value) {
  const locator = _.find(
    formattedValueLocators,
    eachLocator => metric.match(eachLocator.metric)
  );

  if (!locator) {
    throw new Error('No locator found for metric ' + metric);
  }
  return locator.locator(value);
}
