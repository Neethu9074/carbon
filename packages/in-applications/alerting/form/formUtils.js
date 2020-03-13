import { selectOptions } from 'in-applications/alerting/form/formData';

export function getMetricLabel(alertType, value) {
  const metricList = selectOptions['ruleMetricName'][alertType];

  if (!metricList) {
    return '';
  }

  return metricList.filter(entry => entry.value === value)[0].label;
}

export function getBlueprintLabel(alertType) {
  switch (alertType) {
    case 'errorRate':
      return 'Error Rate';
    case 'slowness':
      return 'Slowness';
    default:
      return '';
  }
}
