import { createMapForm, createField } from 'formalistic';

import createTimeThresholdForm from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import { getInitialThresholdType } from 'in-websites/alerting/form/thresholdFormData';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import createRuleForm from 'in-websites/alerting/form/ruleForm';

const severityWarning = 5;

export const fieldNames = Object.freeze({
  tagFilters: 'tagFilters',
  alertChannelIds: 'alertChannelIds',
  enabled: 'enabled',
  triggering: 'triggering',
  severity: 'severity',
  description: 'description',
  name: 'name',
  websiteId: 'websiteId',
  id: 'id'
});

// We don't sent this fields to the api
export const hiddenFieldNames = Object.freeze({
  calculateThresholdOnBackend: 'calculateThresholdOnBackend',
  alertByNumberOfImpactedUsersEnabled: 'alertByNumberOfImpactedUsersEnabled',
  alertByPercentageOfImpactedUsersEnabled: 'alertByPercentageOfImpactedUsersEnabled'
});

export default function alertFormDefinition(alertConfig = {}) {
  const {
    tagFilters = [],
    alertChannelIds = [],
    enabled = true,
    triggering = false,
    severity = severityWarning,
    description = '',
    name = '',
    websiteId = '',
    id = '',
    threshold = ''
  } = alertConfig;

  let form = createMapForm()
    .put(
      fieldNames.tagFilters,
      createField({
        value: tagFilters
      })
    )
    .put(
      fieldNames.alertChannelIds,
      createField({
        value: alertChannelIds,
        validator: array => {
          if (!array || array.length === 0) {
            return [
              {
                severity: 'error',
                message: 'Please select at least one Alert Channel'
              }
            ];
          }
        }
      })
    )
    .put(
      fieldNames.enabled,
      createField({
        value: enabled
      })
    )
    .put(
      fieldNames.triggering,
      createField({
        value: triggering
      })
    )
    .put(
      fieldNames.severity,
      createField({
        value: severity
      })
    )
    .put(
      fieldNames.description,
      createField({
        value: description
      })
    )
    .put(
      fieldNames.name,
      createField({
        value: name
      })
    )
    .put(
      fieldNames.websiteId,
      createField({
        value: websiteId
      })
    )
    .put(
      fieldNames.id,
      createField({
        value: id
      })
    )
    .put('timeThreshold', createTimeThresholdForm(alertConfig.timeThreshold ?? {}))
    .put(
      'threshold',
      createThresholdForm(
        { ...alertConfig.threshold, type: getInitialThresholdType(alertConfig.threshold) } ?? {},
        alertConfig.rule?.alertType
      )
    )
    .put('rule', createRuleForm(alertConfig.rule ?? {}, getInitialThresholdType(threshold)))
    .put(
      'hiddenFields',
      createHiddenFieldsForm(alertConfig.timeThreshold ?? {}, alertConfig.calculateThresholdOnBackend)
    );

  return form;
}

function createHiddenFieldsForm(timeThreshold, calculateThresholdOnBackend = false) {
  return createMapForm()
    .put(
      'alertByNumberOfImpactedUsersEnabled',
      createField({
        value: !!(timeThreshold && timeThreshold.users)
      })
    )
    .put(
      'alertByPercentageOfImpactedUsersEnabled',
      createField({
        value: !!(typeof timeThreshold.userPercentage === 'undefined' ? true : timeThreshold.userPercentage)
      })
    )
    .put(
      'calculateThresholdOnBackend',
      createField({
        value: calculateThresholdOnBackend
      })
    );
}
