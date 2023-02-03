/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialogWithThreshold';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import alertFormDefinition from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

export default {
  component: AlertConfigDialogWithThreshold,
  argTypes: {
    withTrackClose: { action: 'withTrackClose' },
    withTrackCreate: { action: 'withTrackCreate' },
    onChartViewConfigChange: { action: 'onChartViewConfigChange' },
    selectedChartViewConfigIndex: { action: 'selectedChartViewConfigIndex' },
    trackModeSwitch: { action: 'trackModeSwitch' }
  },
  args: {
    selectedChartViewConfigIndex: 0,
    websiteLabel: 'websiteLabel',
    startWithSimpleMode: false,
    editMode: false,
    messages: [],
    isSaving: false
  }
};

export const AdvancedSlownessAlertConfigDialog = args => {
  const { editMode } = args;
  const [form, updateForm] = useState(alertFormDefinition(slownessAlertConfig(), editMode));

  return (
    <AlertConfigDialogWithThreshold
      {...args}
      startWithSimpleMode={false}
      form={form}
      updateForm={updateForm}
      // only needed for time threshold section
      onChange={(path, updater) => {
        updateForm(form.updateIn(path, updater));
      }}
    />
  );
};

export const SimpleDialogEditModeWithError = args => {
  const { editMode } = args;
  const [form, setForm] = useState(alertFormDefinition(jsSpecificErrorAlertConfig, editMode));

  return <AlertConfigDialogWithThreshold {...args} form={form} updateForm={setForm} />;
};

SimpleDialogEditModeWithError.args = {
  startWithSimpleMode: true,
  messages: [
    enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError({
      message:
        'The maximum number of website alert configurations (9990000) has been reached. Please contact Instana support to request an increase for this limit.'
    })
  ]
};

const jsSpecificErrorAlertConfig = Object.freeze({
  id: '<generated server side',
  name: 'JS Specific errors example',
  description: 'Foobar description',
  severity: 5,
  triggering: false,
  tagFilterExpression: emptyTagFilterExpression,
  rule: {
    alertType: 'specificJsError',
    matchingOperator: 'CONTAINS',
    value: 'unknown error'
  },
  threshold: {
    value: '12',
    operator: '>'
  },
  baseline: {
    to: 0,
    windowSize: 0,
    seasonality: DAILY,
    granularity: 0,
    segments: [],
    sdFactor: 1.0
  },
  alertChannelIds: [],
  enabled: true
});

const slownessAlertConfig = () =>
  Object.freeze({
    enabled: true,
    websiteId: '',
    id: '<generated server side',
    threshold: {
      type: 'staticThreshold',
      operator: '>=',
      lastUpdated: 0,
      value: 123
    },
    rule: {
      alertType: 'slowness',
      metricName: 'onLoadTime',
      aggregation: 'P90'
    },
    granularity: 600000,
    timeThreshold: {
      type: 'userImpactOfViolationsInSequence',
      timeWindow: 1800000,
      impactMeasurementMethod: 'AGGREGATED',
      userPercentage: 0.2,
      users: 20
    },
    baseline: {
      to: 0,
      windowSize: 0,
      seasonality: DAILY,
      granularity: 0,
      segments: [],
      sdFactor: 1.0
    },
    alertChannelIds: [],
    triggering: false,
    severity: 5,
    description: 'Foobar description',
    name: 'JS Specific errors example',
    customPayloadFields: []
  });
