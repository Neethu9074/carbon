import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-websites/alerting/form/formUtils';
import { fieldNames } from 'in-websites/alerting/form/alertDialogFormDefinition';

export default function toAlertConfig(form) {
  return Object.freeze({
    rule: form.get('rule').toJS(),
    tagFilters: form.get(fieldNames.tagFilters).value,
    alertChannelIds: form.get(fieldNames.alertChannelIds).value,
    enabled: form.get(fieldNames.enabled).value,
    triggering: form.get(fieldNames.triggering).value,
    severity: form.get(fieldNames.severity).value,
    description: form.get(fieldNames.description).value || getDescriptionPlaceholder(form),
    name: form.get(fieldNames.name).value || getTitlePlaceholder(form),
    websiteId: form.get(fieldNames.websiteId).value,
    threshold: form.get('threshold').toJS(),
    timeThreshold: form.get('timeThreshold').toJS(),
    granularity: form.get(fieldNames.granularity).value
  });
}

export function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}
