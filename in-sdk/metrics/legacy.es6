import { find } from 'in-services/arrayUtils';

// {
//   metric: /^memory\.free/,
//   locator: snapshot => max value
// }
const maxValueLocators = [];
const minValueLocators = [];
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

export function addFormattedValueLocator(metric, locator) {
  formattedValueLocators.push({
    metric,
    locator
  });
}

export function getMaxValue(metric, snapshot) {
  const locator = find(maxValueLocators, eachLocator => metric.match(eachLocator.metric));

  if (!locator) {
    throw new Error('No locator found for metric ' + metric);
  }

  return locator.locator(snapshot, metric.match(locator.metric));
}

export function getMinValue(metric, snapshot) {
  const locator = find(minValueLocators, eachLocator => metric.match(eachLocator.metric));

  if (!locator) {
    throw new Error('No locator found for metric ' + metric);
  }
  return locator.locator(snapshot, metric.match(locator.metric));
}

export function getFormattedValue(metric, snapshot, value) {
  const locator = find(formattedValueLocators, eachLocator => metric.match(eachLocator.metric));

  if (!locator) {
    throw new Error('No locator found for metric ' + metric);
  }
  return locator.locator(getMaxValue(metric, snapshot), value);
}
