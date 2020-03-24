import { createMapForm, createField, notBlankValidator } from 'formalistic';

import {
  withSlownessFormStaticThreshold,
  withSlownessFormHistoricBaseline
} from 'in-websites/eum-alerting/form/slownessForm';
import { withStatusCodesFormSpecificStatusCode } from 'in-websites/eum-alerting/form/statusCodesForm';
import createTimeThresholdForm from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import createRuleForm from 'in-websites/eum-alerting/form/ruleForm';

const severityWarning = 5;

export const fieldNames = Object.freeze({
  // TODO: Refactor: get rid of these
  tagFilters: 'tagFilters',
  alertChannelIds: 'alertChannelIds',
  enabled: 'enabled',
  triggering: 'triggering',
  severity: 'severity',
  description: 'description',
  name: 'name',
  websiteId: 'websiteId',
  id: 'id',

  // TODO: Refactor: get rid of these
  thresholdValue: 'thresholdValue',
  thresholdType: 'thresholdType',
  thresholdLastUpdated: 'thresholdLastUpdated',
  thresholdOperator: 'thresholdOperator',
  thresholdSeasonality: 'thresholdSeasonality',
  thresholdBaseline: 'thresholdBaseline',
  thresholdDeviationFactor: 'thresholdDeviationFactor'
});

// TODO: Refactor: get rid of these
// We don't sent this fields to the api
export const hiddenFieldNames = Object.freeze({
  calculateThresholdOnBackend: 'calculateThresholdOnBackend',
  alertByNumberOfImpactedUsersEnabled: 'alertByNumberOfImpactedUsersEnabled',
  alertByPercentageOfImpactedUsersEnabled: 'alertByPercentageOfImpactedUsersEnabled'
});

export const selectOptions = Object.freeze({
  [fieldNames.thresholdOperator]: Object.freeze([
    { value: '>=', label: '≥' },
    { value: '>', label: '>' },
    { value: '<=', label: '≤' },
    { value: '<', label: '<' }
  ]),
  [fieldNames.thresholdType]: Object.freeze([
    { value: 'staticThreshold', label: 'Static Threshold' },
    { value: 'historicBaseline.DAILY', label: 'Baseline (Daily Seasonality)' },
    { value: 'historicBaseline.WEEKLY', label: 'Baseline (Weekly Seasonality)' }
  ])
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
    .put(
      fieldNames.thresholdType,
      createField({
        value: threshold.type && getInitialThresholdType(threshold),
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.thresholdOperator,
      createField({
        value: (threshold && threshold.operator) || '>=',
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.thresholdLastUpdated,
      createField({
        value: (threshold && threshold.lastUpdated) || 0
      })
    )
    .put(
      fieldNames.thresholdValue,
      createField({
        value: (threshold && threshold.value) || null,
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
    )
    .put('timeThreshold', createTimeThresholdForm(alertConfig.timeThreshold ?? {}))
    .put('rule', createRuleForm(alertConfig.rule ?? {}, getInitialThresholdType(threshold)))
    .put(
      'hiddenFields',
      createHiddenFieldsForm(alertConfig.timeThreshold ?? {}, alertConfig.calculateThresholdOnBackend)
    );

  const alertType = form.get('rule').get('alertType').value;

  if (alertType === alertTypes.slowness) {
    const thresholdType = form.get(fieldNames.thresholdType).value;

    if (thresholdType === 'staticThreshold') {
      form = withSlownessFormStaticThreshold(form, threshold);
    }

    if (thresholdType.includes('historicBaseline.')) {
      form = withSlownessFormHistoricBaseline(form, threshold);
    }
  } else if (alertType === alertTypes.specificJsError) {
    form = withJsErrorsFormSpecificError(form);
  } else if (alertType === alertTypes.specificStatusCode) {
    form = withStatusCodesFormSpecificStatusCode(form);
  }

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

function getInitialThresholdType(threshold) {
  return threshold.type === 'historicBaseline' ? `${threshold.type}.${threshold.seasonality}` : 'staticThreshold';
}
