'use strict';

// metric => snapshot => max value (number)
const maxValueLocators = {};

export function addMaxValueLocator(metric, locator) {
  maxValueLocators[metric] = locator;
}

export function getMaxValue(metric, snapshot) {
  return maxValueLocators[metric](snapshot);
}
