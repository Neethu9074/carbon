'use strict';

import _ from 'lodash';

// {
//   metric: /^memory\.free/,
//   locator: snapshot => max value
// }
const maxValueLocators = [];

export function addMaxValueLocator(metric, locator) {
  maxValueLocators.push({
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
  return locator.locator(snapshot);
}
