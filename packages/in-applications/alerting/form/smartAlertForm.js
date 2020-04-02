import { createMapForm, createField } from 'formalistic';

import { createSlownessForm, createErrorRateForm } from 'in-applications/alerting/form/thresholdForm';
import createTimeThresholdForm from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import { getInitialThresholdType } from 'in-applications/alerting/form/thresholdFormData';
import createRuleForm from 'in-applications/alerting/form/ruleForm';

const defaultSeverity = 5;
const defaultGranularity = 600000;

export function createSmartAlertForm(alertConfig) {
  const form = createMapForm()
    .put(
      'name',
      createField({
        value: alertConfig.name ?? ''
      })
    )
    .put(
      'description',
      createField({
        value: alertConfig.description ?? ''
      })
    )
    .put(
      'applicationId',
      createField({
        value: alertConfig.applicationId ?? ''
      })
    )
    .put(
      'severity',
      createField({
        value: alertConfig.severity ?? defaultSeverity
      })
    )
    .put(
      'triggering',
      createField({
        value: alertConfig.triggering ?? false
      })
    )
    .put(
      'tagFilters',
      createField({
        value: alertConfig.tagFilters ?? []
      })
    )
    .put(
      'alertChannelIds',
      createField({
        value: alertConfig.alertChannelIds ?? [],
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
      'granularity',
      createField({
        value: alertConfig.granularity ?? defaultGranularity
      })
    )
    .put(
      'id',
      createField({
        value: alertConfig.id ?? ''
      })
    )
    .put(
      'created',
      createField({
        value: alertConfig.created ?? ''
      })
    )
    .put(
      'readOnly',
      createField({
        value: alertConfig.readOnly ?? false
      })
    )
    .put(
      'enabled',
      createField({
        value: alertConfig.enabled ?? true
      })
    )
    .put('rule', createRuleForm(alertConfig.rule ?? {}))
    .put('timeThreshold', createTimeThresholdForm(alertConfig.timeThreshold ?? {}))
    .put(
      'hiddenFields',
      createHiddenFieldsForm(alertConfig.timeThreshold ?? {}, alertConfig.calculateThresholdOnBackend)
    );

  const alertType = alertConfig.rule?.alertType ?? 'errorRate';

  if (alertType === 'slowness') {
    return form.put(
      'threshold',
      createSlownessForm({ ...alertConfig.threshold, type: getInitialThresholdType(alertConfig.threshold) } ?? {})
    );
  }

  if (alertType === 'errorRate') {
    return form.put('threshold', createErrorRateForm(alertConfig.threshold));
  }
}

function createHiddenFieldsForm(timeThreshold, calculateThresholdOnBackend = false) {
  return createMapForm().put(
    'calculateThresholdOnBackend',
    createField({
      value: calculateThresholdOnBackend
    })
  );
}
