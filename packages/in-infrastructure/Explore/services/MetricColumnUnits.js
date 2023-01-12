/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { getFormatterType, PERCENTAGE_FORMATTER_TYPE, UNDEFINED_FORMATTER_TYPE } from 'in-services/formatters/number';

/*
 Utility functions that enable units to be applied
 to metrics that are exported in csv format.
 */

var metricFormatter = {};

/*
 setMetricColumnUnits records the unit type
 (bytes, percent, etc.) for each metric
 column.
 */
export function setMetricColumnUnits(id, formatter) {
  if (metricFormatter[id] != null) {
    return;
  }
  metricFormatter[id] = getFormatterType(formatter);
}

/*
 addMetricColumnUnits appends the metric formatter
 type (BYTES, PERCENTAGE, etc.) to the metric
 id and returns it. The formatter type
 is prefaced with a period.
 */
export function addMetricColumnUnits(id) {
  var formatterName = metricFormatter[id] != null ? metricFormatter[id] : UNDEFINED_FORMATTER_TYPE;

  if (formatterName === UNDEFINED_FORMATTER_TYPE) {
    return id;
  }
  return id + '.' + formatterName.toString();
}

/*
 formatMetricColumnValue formats a metric value
 based upon its type. At present only percentage
 metrics are formatted.
 */
export function formatMetricColumnValue(id, value) {
  var metricValue = value;

  // convert decimal representation to a percentage
  if (metricFormatter[id] === PERCENTAGE_FORMATTER_TYPE) {
    metricValue = Number(value * 100).toFixed(2);
  }
  return metricValue;
}
