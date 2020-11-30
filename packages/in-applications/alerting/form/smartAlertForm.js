import { createMapForm, createField } from 'formalistic';

import createTimeThresholdForm from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import createRuleForm from 'in-applications/alerting/form/ruleForm';

const defaultSeverity = 5;
const defaultGranularity = 600000;

export function createSmartAlertForm(alertConfig) {
  let form = createMapForm()
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
      'boundaryScope',
      createField({
        value: alertConfig.boundaryScope ?? 'INBOUND'
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
    // QB1
    .put(
      'tagFilters',
      createField({
        value: alertConfig.tagFilters ?? []
      })
    )
    // QB2
    .put(
      'tagFilterExpression',
      createField({
        value: fromBackendModel(alertConfig.tagFilterExpression)
      })
    )
    .put(
      'convertedTagFilterExpression',
      createField({
        value: alertConfig.convertedTagFilterExpression
      })
    )
    .put(
      'alertChannelIds',
      createField({
        value: alertConfig.alertChannelIds ?? []
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
  return form.put('threshold', createThresholdForm(alertConfig.threshold, alertType));
}

function createHiddenFieldsForm(timeThreshold, calculateThresholdOnBackend = false) {
  return createMapForm().put(
    'calculateThresholdOnBackend',
    createField({
      value: calculateThresholdOnBackend
    })
  );
}
