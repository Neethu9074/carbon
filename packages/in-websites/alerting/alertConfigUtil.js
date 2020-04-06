import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-websites/alerting/form/formUtils';
import { getThresholdWithFixedType } from 'in-new-components/Alerting/utils/formUtils';
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
    threshold: getThresholdWithFixedType(form.get('threshold').toJS()),
    timeThreshold: getTimeThreshold(form)
  });
}

function getTimeThreshold(form) {
  const timeThresholdForm = form.get('timeThreshold');
  const hiddenFieldsForm = form.get('hiddenFields');
  const timeThreshold = timeThresholdForm.toJS();

  if (timeThresholdForm.get('type').value === timeThresholdTypes.userImpactOfViolationsInSequence) {
    timeThreshold['users'] = hiddenFieldsForm.get('alertByNumberOfImpactedUsersEnabled').value
      ? timeThresholdForm.get('users').value
      : null;

    timeThreshold['userPercentage'] = hiddenFieldsForm.get('alertByPercentageOfImpactedUsersEnabled').value
      ? timeThresholdForm.get('userPercentage').value
      : null;
  }

  return timeThreshold;
}

export function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}
