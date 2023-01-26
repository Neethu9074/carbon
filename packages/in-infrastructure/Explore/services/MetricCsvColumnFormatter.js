/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import {
  getFormatterType,
  NUMBER_FORMATTER_TYPE,
  PERCENTAGE_FORMATTER_TYPE,
  UNDEFINED_FORMATTER_TYPE
} from 'in-services/formatters/number';

/*
 Utility functions that format metric column names and
 values. Enables units to be applied to metrics column
 names that are exported in csv format.
 */

/*
 formatCsvColumnName formats a metric column name,
 appending the metric aggregation and formatter type
 (BYTES, PERCENTAGE, etc.) to the name.
 */
export function formatCsvColumnName(metricLabel, aggregation, formatter) {
  const metricAggregation = aggregation.toString().toLowerCase();
  const formatterName = getFormatterType(formatter);

  var columnQualifier;

  if (formatterName === UNDEFINED_FORMATTER_TYPE || formatterName === NUMBER_FORMATTER_TYPE) {
    columnQualifier = ' (' + metricAggregation + ')';
  } else {
    columnQualifier = ' (' + metricAggregation + ' ' + formatterName.toString().toLowerCase() + ')';
  }

  return metricLabel + columnQualifier;
}

/*
 formatCsvColumnValue formats a metric value
 based upon its formatter type. At present only
 percentage metrics are formatted.
 */
export function formatCsvColumnValue(formatter, value) {
  const formatterName = getFormatterType(formatter);

  var metricValue = value;

  // convert decimal representation to a percentage
  if (formatterName === PERCENTAGE_FORMATTER_TYPE) {
    metricValue = Number(value * 100).toFixed(2);
    // Round to nearest integer if specified by the formatter
    if (formatter.toString().includes('zeroDecimalPlaces')) {
      metricValue = Math.round(metricValue);
    }
  }
  return metricValue;
}
