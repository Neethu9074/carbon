import { createMapForm, createField } from 'formalistic';

import createTimeThresholdForm from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';

const defaultSeverity = 5;
const defaultGranularity = 600000;

export function CreateSmartAlertForm(alertConfig) {
  return createMapForm()
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
        value: alertConfig.triggering ?? true
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
    .put('threshold', createThresholdForm(alertConfig.threshold ?? {}))
    .put('timeThreshold', createTimeThresholdForm(alertConfig.timeThreshold ?? {}))
    .put('rule', createRuleForm(alertConfig.rule ?? {}));
}

function createThresholdForm(threshold) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold.type ?? 'staticThreshold'
      })
    )
    .put(
      'lastUpdated',
      createField({
        value: threshold.lastUpdated ?? 0
      })
    )
    .put(
      'operator',
      createField({
        value: threshold.operator ?? '>='
      })
    )
    .put(
      'value',
      createField({
        value: threshold.value ?? '',
        validator: num => {
          if (num === '' || num < 0) {
            return [
              {
                severity: 'error',
                message: 'Please provide a number >= 0'
              }
            ];
          }
        }
      })
    );
}

function createRuleForm(rule) {
  return createMapForm()
    .put(
      'alertType',
      createField({
        value: rule.alertType ?? 'errorRate'
      })
    )
    .put(
      'metricName',
      createField({
        value: rule.metricName ?? 'errors'
      })
    );
}
