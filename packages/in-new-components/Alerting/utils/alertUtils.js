export function mapThresholdValueAndOperatorForAnalyze(thresholdValue, thresholdOperator) {
  // adjust value because tag-filters only support LESS_THAN and GREATER_THAN
  if (thresholdOperator === '<=') {
    thresholdValue = Math.floor(thresholdValue) + 1;
  } else if (thresholdOperator === '>=') {
    thresholdValue = Math.ceil(thresholdValue) - 1;
  }

  return {
    operator: toTagFilterNumberOperator(thresholdOperator),
    value: thresholdValue
  };
}

function toTagFilterNumberOperator(thresholdOperator) {
  switch (thresholdOperator) {
    case '<':
    case '<=':
      return 'LESS_THAN';
    case '>':
    case '>=':
      return 'GREATER_THAN';
    default:
      return thresholdOperator;
  }
}
