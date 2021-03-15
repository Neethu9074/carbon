/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

export const alertPropType = PropTypes.shape({
  start: PropTypes.number,
  end: PropTypes.number,
  key: PropTypes.string
});

export const eventDataPropType = PropTypes.arrayOf(
  PropTypes.shape({
    timestamp: PropTypes.number,
    duration: PropTypes.number,
    alerts: PropTypes.arrayOf(alertPropType)
  })
);

export const rulePropType = PropTypes.shape({
  alertType: PropTypes.string,
  metricName: PropTypes.string,
  aggregation: PropTypes.string
});

export const alertRulesPropType = PropTypes.shape({
  // this object can contain multiples keys, but it's not possible to expresse this with propTypes
  key: PropTypes.shape({
    rule: rulePropType
  })
});

export const thresholdPropType = PropTypes.shape({
  type: PropTypes.oneOf(['staticThreshold', 'historicBaseline']),
  operator: PropTypes.string,
  value: PropTypes.number, // if type === 'staticThreshold'
  baseline: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)), // if type === 'historicBaseline'
  seasonality: PropTypes.oneOf(['DAILY', 'WEEKLY'])
});

export const thresholdsPropType = PropTypes.shape({
  // this object can contain multiples keys, but it's not possible to expresse this with propTypes
  keyA: thresholdPropType,
  keyB: thresholdPropType
  // ...
});

export const potentialProblemsLaneAlertsPropType = PropTypes.shape({
  thresholds: thresholdsPropType,
  alerts: PropTypes.arrayOf(alertPropType)
});
