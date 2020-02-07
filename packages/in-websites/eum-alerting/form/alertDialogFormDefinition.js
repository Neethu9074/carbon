import { createMapForm, createField, notBlankValidator } from 'formalistic';

import {
  withSlownessFormStaticThreshold,
  withSlownessFormHistoricBaseline
} from 'in-websites/eum-alerting/form/slownessForm';
import { withStatusCodesFormSpecificStatusCode } from 'in-websites/eum-alerting/form/statusCodesForm';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { operators } from 'in-analyze/applicationFilter';

const severityWarning = 5;
const severityCritical = 10;

export const fieldNames = Object.freeze({
  ruleAggregation: 'ruleAggregation',
  ruleAlertType: 'ruleAlertType',
  ruleOperator: 'ruleOperator',
  ruleValue: 'ruleValue',
  ruleMetricName: 'ruleMetricName',
  tagFilters: 'tagFilters',
  alertChannelIds: 'alertChannelIds',
  enabled: 'enabled',
  triggering: 'triggering',
  severity: 'severity',
  description: 'description',
  name: 'name',
  websiteId: 'websiteId',
  id: 'id',
  thresholdValue: 'thresholdValue',
  thresholdType: 'thresholdType',
  thresholdLastUpdated: 'thresholdLastUpdated',
  thresholdOperator: 'thresholdOperator',
  thresholdSeasonality: 'thresholdSeasonality',
  thresholdBaseline: 'thresholdBaseline',
  thresholdDeviationFactor: 'thresholdDeviationFactor',
  timeThresholdViolations: 'timeThresholdViolations',
  timeThresholdTimeWindow: 'timeThresholdTimeWindow',
  timeThresholdType: 'timeThresholdType',
  timeThresholdUsers: 'timeThresholdUsers',
  timeThresholdUserPercentage: 'timeThresholdUserPercentage'
});

// We don't sent this fields to the api
export const hiddenFieldNames = Object.freeze({
  calculateThresholdOnBackend: 'calculateThresholdOnBackend',
  alertByNumberOfImpactedUsersEnabled: 'alertByNumberOfImpactedUsersEnabled',
  alertByPercentageOfImpactedUsersEnabled: 'alertByPercentageOfImpactedUsersEnabled'
});

export const selectOptions = {
  [fieldNames.ruleOperator]: Object.freeze([
    { value: operators.EQUALS, label: 'Equals' },
    { value: operators.CONTAINS, label: 'Contains' },
    { value: operators.STARTS_WITH, label: 'Starts with' },
    { value: operators.ENDS_WITH, label: 'Ends with' }
  ]),
  [fieldNames.ruleValue]: Object.freeze([
    { value: '1', label: '1XX (Informational)' },
    { value: '100', label: '100 (Continue)' },
    { value: '101', label: '101 (Switching Protocols)' },
    { value: '102', label: '102 (Processing)' },
    { value: '103', label: '103 (Early Hints)' },
    { value: '2', label: '2XX (Success)' },
    { value: '200', label: '200 (OK)' },
    { value: '201', label: '201 (Created)' },
    { value: '202', label: '202 (Accepted)' },
    { value: '203', label: '203 (Non-authoritative Information)' },
    { value: '204', label: '204 (No Content)' },
    { value: '205', label: '205 (Reset Content)' },
    { value: '206', label: '206 (Partial Content)' },
    { value: '207', label: '207 (Multi-Status)' },
    { value: '208', label: '208 (Already Reported)' },
    { value: '226', label: '226 (IM Used)' },
    { value: '3', label: '3XX (Redirection)' },
    { value: '300', label: '300 (Multiple Choices)' },
    { value: '301', label: '301 (Moved Permanently)' },
    { value: '302', label: '302 (Found)' },
    { value: '303', label: '303 (See Other)' },
    { value: '304', label: '304 (Not Modified)' },
    { value: '305', label: '305 (Use Proxy)' },
    { value: '306', label: '306 (Switch Proxy)' },
    { value: '307', label: '307 (Temporary Redirect)' },
    { value: '308', label: '308 (Permanent Redirect)' },
    { value: '4', label: '4XX (Client Error)' },
    { value: '400', label: '400 (Bad Request)' },
    { value: '401', label: '401 (Unauthorized)' },
    { value: '402', label: '402 (Payment Required)' },
    { value: '403', label: '403 (Forbidden)' },
    { value: '404', label: '404 (Not Found)' },
    { value: '405', label: '405 (Method Not Allowed)' },
    { value: '406', label: '406 (Not Acceptable)' },
    { value: '407', label: '407 (Proxy Authentication Required)' },
    { value: '408', label: '408 (Request Timeout)' },
    { value: '409', label: '409 (Conflict)' },
    { value: '410', label: '410 (Gone)' },
    { value: '411', label: '411 (Length Required)' },
    { value: '412', label: '412 (Precondition Failed)' },
    { value: '413', label: '413 (Payload Too Large)' },
    { value: '414', label: '414 (Request-URI Too Long)' },
    { value: '415', label: '415 (Unsupported Media Type)' },
    { value: '416', label: '416 (Requested Range Not Satisfiable)' },
    { value: '417', label: '417 (Expectation Failed)' },
    { value: '418', label: "418 (I'm a teapot" },
    { value: '421', label: '421 (Misdirected Request)' },
    { value: '422', label: '422 (Unprocessable Entity)' },
    { value: '423', label: '423 (Locked)' },
    { value: '424', label: '424 (Failed Dependency)' },
    { value: '426', label: '426 (Upgrade Required)' },
    { value: '428', label: '428 (Precondition Required)' },
    { value: '429', label: '429 (Too Many Requests)' },
    { value: '431', label: '431 (Request Header Fields Too Large)' },
    { value: '444', label: '444 (Connection Closed Without Response)' },
    { value: '451', label: '451 (Unavailable For Legal Reasons)' },
    { value: '499', label: '499 (Client Closed Request)' },
    { value: '5XX', label: '5XX (Server Error)' },
    { value: '500', label: '500 (Internal Server Error)' },
    { value: '501', label: '501 (Not Implemented)' },
    { value: '502', label: '502 (Bad Gateway)' },
    { value: '503', label: '503 (Service Unavailable)' },
    { value: '504', label: '504 (Gateway Timeout)' },
    { value: '505', label: '505 (HTTP Version Not Supported)' },
    { value: '506', label: '506 (Variant Also Negotiates)' },
    { value: '507', label: '507 (Insufficient Storage)' },
    { value: '508', label: '508 (Loop Detected)' },
    { value: '510', label: '510 (Not Extended)' },
    { value: '511', label: '511 (Network Authentication Required)' },
    { value: '599', label: '599 (Network Connect Timeout Error)' }
  ]),
  [fieldNames.ruleMetricName]: {
    [alertTypes.specificJsError]: Object.freeze([
      { value: 'errors', label: 'Errors count' },
      { value: 'specificJsErrorRate', label: 'Errors rate' }
    ]),
    [alertTypes.specificStatusCode]: Object.freeze([
      { value: 'httpxxx', label: 'Status code count' },
      { value: 'specificStatusCodeRate', label: 'Status code rate' }
    ]),
    [alertTypes.slowness]: Object.freeze([{ value: 'onLoadTime', label: 'onLoad Time' }])
  },
  [fieldNames.ruleAggregation]: Object.freeze([
    { value: 'MEAN', label: 'mean' },
    { value: 'MIN', label: 'min' },
    { value: 'P25', label: '25th' },
    { value: 'P50', label: '50th' },
    { value: 'P75', label: '75th' },
    { value: 'P90', label: '90th (recommended)' },
    { value: 'P95', label: '95th' },
    { value: 'P98', label: '98th' },
    { value: 'P99', label: '99th' },
    { value: 'MAX', label: 'max' }
  ]),
  ruleAggregationForWeeklySeasonality: Object.freeze([
    { value: 'MEAN', label: 'mean' },
    { value: 'P50', label: '50th' }
  ]),
  [fieldNames.thresholdOperator]: Object.freeze([
    { value: '>=', label: '≥' },
    { value: '>', label: '>' },
    { value: '<=', label: '≤' },
    { value: '<', label: '<' }
  ]),
  [fieldNames.severity]: Object.freeze([
    { value: severityWarning, label: 'Warning' },
    { value: severityCritical, label: 'Critical' }
  ]),
  [fieldNames.thresholdType]: Object.freeze([
    { value: 'staticThreshold', label: 'Static Threshold' },
    { value: 'historicBaseline.DAILY', label: 'Baseline (Daily Seasonality)' },
    { value: 'historicBaseline.WEEKLY', label: 'Baseline (Weekly Seasonality)' }
  ]),
  conditionPersistenceTime: Object.freeze([
    { value: 600000, label: '10 min' },
    { value: 1200000, label: '20 min' },
    { value: 1800000, label: '30 min' },
    { value: 3600000, label: '60 min' },
    { value: 5400000, label: '90 min' },
    { value: 7200000, label: '120 min' }
  ])
};

export const radioOptions = {
  timeThresholdType: {
    violationsInSequence: 'violationsInSequence',
    violationsInPeriod: 'violationsInPeriod',
    userImpactOfViolationsInSequence: 'userImpactOfViolationsInSequence'
  }
};

export default function alertFormDefinition(alertFormValues = {}) {
  const {
    rule = '',
    tagFilters = [],
    alertChannelIds = [],
    enabled = true,
    triggering = false,
    severity = severityWarning,
    description = '',
    name = '',
    websiteId = '',
    id = '',
    threshold = '',
    calculateThresholdOnBackend = false,
    timeThreshold = ''
  } = alertFormValues;

  let form = createMapForm()
    .put(
      fieldNames.ruleAlertType,
      createField({
        value: rule && rule.alertType,
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.ruleMetricName,
      createField({
        value: (rule && rule.metricName) || 'errors',
        validator: notBlankValidator
      })
    )
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
        validator: alertChannelsNotEmptyValidator
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
        value:
          threshold && threshold.type && threshold.type === 'historicBaseline'
            ? `${threshold.type}.${threshold.seasonality}`
            : 'staticThreshold',
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
        value: (threshold && threshold.value) || 0,
        validator: positiveNumberValidator
      })
    )
    .put(
      fieldNames.timeThresholdViolations,
      createField({
        value: (timeThreshold && timeThreshold.violations) || 1
      })
    )
    .put(
      fieldNames.timeThresholdTimeWindow,
      createField({
        value: (timeThreshold && timeThreshold.timeWindow) || 600000
      })
    )
    .put(
      fieldNames.timeThresholdType,
      createField({
        value: (timeThreshold && timeThreshold.type) || radioOptions.timeThresholdType.violationsInSequence
      })
    )
    .put(
      fieldNames.timeThresholdUsers,
      createField({
        validator: numAffectedUsersValidator,
        value: (timeThreshold && timeThreshold.users) || 20
      })
    )
    .put(
      fieldNames.timeThresholdUserPercentage,
      createField({
        validator: percentageAffectedUsersValidator,
        value: (timeThreshold && timeThreshold.userPercentage) || 0.2
      })
    )
    .put(
      hiddenFieldNames.alertByNumberOfImpactedUsersEnabled,
      createField({
        value: !!(timeThreshold && timeThreshold.users !== null)
      })
    )
    .put(
      hiddenFieldNames.alertByPercentageOfImpactedUsersEnabled,
      createField({
        value: !!(typeof timeThreshold.userPercentage === 'undefined' ? true : timeThreshold.userPercentage)
      })
    )
    .put(
      hiddenFieldNames.calculateThresholdOnBackend,
      createField({
        value: calculateThresholdOnBackend
      })
    );

  const alertType = form.get(fieldNames.ruleAlertType).value;

  if (alertType === alertTypes.slowness) {
    const thresholdType = form.get(fieldNames.thresholdType).value;

    if (thresholdType === 'staticThreshold') {
      form = withSlownessFormStaticThreshold(form, rule, threshold);
    }

    if (thresholdType.includes('historicBaseline.')) {
      form = withSlownessFormHistoricBaseline(form, rule, threshold);
    }
  } else if (alertType === alertTypes.specificJsError) {
    form = withJsErrorsFormSpecificError(form, rule);
  } else if (alertType === alertTypes.specificStatusCode) {
    form = withStatusCodesFormSpecificStatusCode(form, rule);
  }

  return form;
}

export function getStatusCodeLabel(value) {
  return selectOptions[fieldNames.ruleValue].filter(entry => entry.value === value)[0].label;
}

export function getRuleOperatorLabel(value) {
  return selectOptions[fieldNames.ruleOperator].filter(entry => entry.value === value)[0].label;
}

export function getMetricLabel(alertType, value) {
  const metricList = selectOptions[fieldNames.ruleMetricName][alertType];

  if (!metricList) {
    return '';
  }

  if (value === null && alertType === 'specificJsError') {
    return 'Errors count';
  }

  return metricList.filter(entry => entry.value === value)[0].label;
}

function alertChannelsNotEmptyValidator(array) {
  if (!array || array.length === 0) {
    return [
      {
        severity: 'error',
        message: 'Please select at least one Alert Channel'
      }
    ];
  }
}

function positiveNumberValidator(num) {
  if (num === '' || num < 0) {
    return [
      {
        severity: 'error',
        message: 'Please provide a number >= 0'
      }
    ];
  }
}

function numAffectedUsersValidator(num) {
  if (num === '' || num < 1) {
    return [
      {
        severity: 'error',
        message: 'Please provide a number >= 1'
      }
    ];
  }
}

function percentageAffectedUsersValidator(num) {
  if (num === '' || num < 0.01 || num > 1.0) {
    return [
      {
        severity: 'error',
        message: 'Please provide a number between 1% and 100%'
      }
    ];
  }
}
