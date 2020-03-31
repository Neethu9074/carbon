/**
 * Converts the threshold-type to its proper form when sent to the backend.
 */
export function getThresholdWithFixedType(threshold) {
  if (threshold.type.startsWith('historicBaseline.')) {
    threshold.type = 'historicBaseline';
  }
  return threshold;
}

export function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}

export function getOperatorText(operator) {
  switch (operator) {
    case '>':
      return 'greater than';
    case '>=':
      return 'greater or equal to';
    case '<':
      return 'less than';
    case '<=':
      return 'less or equal to';
    default:
      return operator;
  }
}

export function getAggregationText(aggregation) {
  switch (aggregation.toUpperCase()) {
    case 'P25':
      return '25th';
    case 'P50':
      return '50th';
    case 'P75':
      return '75th';
    case 'P90':
      return '90th';
    case 'P95':
      return '95th';
    case 'P98':
      return '98th';
    case 'P99':
      return '99th';
    default:
      return aggregation.toLowerCase();
  }
}
