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

export function getDescriptionPlaceholder(form) {
  switch (form.get('rule').get('alertType').value) {
    case 'errorRate':
      return `TODO: JS Errors which FOO BAR have been detected.`;
    case 'slowness':
      return `TODO:The onLoad Time FOO BAR is BLA above/below the expectation.`;

    default:
      return '';
  }
}

export function getTitlePlaceholder(form) {
  switch (form.get('rule').get('alertType').value) {
    case 'errorRate':
      return `TODO: Implememnt title placeholder`;
    case 'slowness':
      return `TODO: Implememnt title placeholder`;
    default:
      return '';
  }
}
