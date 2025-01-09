/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import {
  getFormatterType,
  NUMBER_FORMATTER_TYPE,
  MILLIS_FORMATTER_TYPE,
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

  let columnQualifier;

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
  const type = getFormatterType(formatter);

  if (type === PERCENTAGE_FORMATTER_TYPE || type === NUMBER_FORMATTER_TYPE || type === MILLIS_FORMATTER_TYPE) {
    return formatter(value).replace(/[^0-9.,]+/, '');
  }
  return value;
}
