import { createMapForm, createField } from 'formalistic';
import { get } from 'lodash';

export function createApplicationSmartAlertForm(alertConfig) {
  return createMapForm()
    .put(
      'name',
      createField({
        value: get(alertConfig, 'name', '')
      })
    )
    .put(
      'description',
      createField({
        value: get(alertConfig, 'description', '')
      })
    )
    .put(
      'applicationId',
      createField({
        value: get(alertConfig, 'applicationId', '')
      })
    )
    .put(
      'severity',
      createField({
        value: get(alertConfig, 'severity', 1)
      })
    )
    .put(
      'triggering',
      createField({
        value: get(alertConfig, 'triggering', true)
      })
    )
    .put(
      'tagFilters',
      createField({
        value: get(alertConfig, 'tagFilters', [])
      })
    )
    .put(
      'alertChannelIds',
      createField({
        value: get(alertConfig, 'alertChannelIds', []),
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
        value: get(alertConfig, 'granularity', 600000)
      })
    )
    .put(
      'id',
      createField({
        value: get(alertConfig, 'id', '')
      })
    )
    .put(
      'created',
      createField({
        value: get(alertConfig, 'created', '')
      })
    )
    .put(
      'readOnly',
      createField({
        value: get(alertConfig, 'readOnly', false)
      })
    )
    .put(
      'enabled',
      createField({
        value: get(alertConfig, 'enabled', true)
      })
    )
    .put('threshold', createThresholdForm(get(alertConfig, 'threshold', {})))
    .put('timeThreshold', createTimeThresholdForm(get(alertConfig, 'timeThreshold', {})))
    .put('rule', createRuleForm(get(alertConfig, 'rule', {})));
}

function createThresholdForm(threshold) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: get(threshold, 'type', 'staticThreshold')
      })
    )
    .put(
      'lastUpdated',
      createField({
        value: get(threshold, 'lastUpdated', 0)
      })
    )
    .put(
      'operator',
      createField({
        value: get(threshold, 'operator', '>=')
      })
    )
    .put(
      'value',
      createField({
        value: get(threshold, 'value', ''),
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

function createTimeThresholdForm(timeThreshold) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: get(timeThreshold, 'type', 'violationsInSequence')
      })
    )
    .put(
      'timeWindow',
      createField({
        value: get(timeThreshold, 'timeWindow', 600000)
      })
    )
    .put(
      'violations',
      createField({
        value: get(timeThreshold, 'violations', 1)
      })
    );
}

function createRuleForm(rule) {
  return createMapForm()
    .put(
      'alertType',
      createField({
        value: get(rule, 'alertType', 'errorRate')
      })
    )
    .put(
      'metricName',
      createField({
        value: get(rule, 'metricName', 'errors')
      })
    );
}
