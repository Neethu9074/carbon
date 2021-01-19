/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getValueRoundedToDecimals } from 'in-new-components/Alerting/utils/formatUtils';
import { getAggregationText } from 'in-new-components/Alerting/utils/formUtils';
import { isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';

export function getTitle({ rule, threshold }) {
  const { operator } = threshold;
  const { alertType, aggregation } = rule;

  switch (alertType) {
    case 'errorRate':
      return 'Erroneous call rate is higher than normal';
    case 'slowness':
      return `Calls (Latency ${aggregation}) are slower than usual`;
    case 'throughput': {
      const isGreaterOp = isGreaterOperator(operator);
      return `Number of calls is anomalously ${isGreaterOp ? 'high' : 'low'}`;
    }
  }
}

export function getDescription({ rule, threshold, alertType }) {
  const { aggregation } = rule;
  const { operator, type, value } = threshold;

  switch (alertType) {
    case 'errorRate': {
      return `The erroneous call rate is ${getHigherOrLowerOperatorText(operator)} ${getValueRoundedToDecimals(
        value,
        true
      )}%.`;
    }
    case 'slowness': {
      if (type === 'staticThreshold') {
        return `Calls are ${getSlowerOrBelowOperatorText(operator)} ${parseInt(
          value
        )} ms based on latency (${getAggregationText(aggregation)}).`;
      }
      return `Calls are ${getSlowerOrBelowOperatorText(
        operator
      )} the expectation based on latency (${getAggregationText(aggregation)}).`;
    }
    case 'throughput': {
      if (type === 'staticThreshold') {
        return `The number of calls is ${getHigherOrLowerOperatorText(operator)} ${parseInt(value)} calls.`;
      }

      let message = '';
      if (operator === '>=') {
        message = 'higher or equal than';
      } else if (operator === '<=') {
        message = 'lower or equal than';
      } else {
        message = getHigherOrLowerOperatorText(operator);
      }

      return `The number of calls is ${message} expected.`;
    }
  }
}

function getHigherOrLowerOperatorText(operator) {
  switch (operator) {
    case '>':
      return 'higher than';
    case '>=':
      return 'higher or equal to';
    case '<':
      return 'lower than';
    case '<=':
      return 'lower than or equal to';
    default:
      throw Error('Unsupported operator: ' + operator);
  }
}

function getSlowerOrBelowOperatorText(operator) {
  switch (operator) {
    case '>':
      return 'slower than';
    case '>=':
      return 'slower than or equal to';
    case '<':
      return 'below';
    case '<=':
      return 'below or equal to';
    default:
      throw Error('Unsupported operator: ' + operator);
  }
}
