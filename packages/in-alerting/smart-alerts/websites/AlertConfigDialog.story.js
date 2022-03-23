/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import { enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/websites/alertConfigDialogWithThreshold/AlertConfigDialogWithThreshold';
import { toAlertConfig } from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import alertFormDefinition from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/AlertConfigDialog';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { noop } from 'in-services/util/function';

export default {
  component: AlertConfigDialogWithThreshold
};

export const AdvancedAlertConfigDialog = () => {
  return <AlertConfigDialog alertConfig={jsSpecificErrorAlertConfig} onClose={noop} />;
};

export const AdvancedSlownessAlertConfigDialog = () => {
  const [form, updateForm] = useState(alertFormDefinition(slownessAlertConfig));

  return (
    <AlertConfigDialogWithThreshold
      updateForm={updateForm}
      // only needed for time threshold section
      onChange={(path, updater) => {
        updateForm(form.updateIn(path, updater));
      }}
      alertConfig={slownessAlertConfig}
      form={form}
      withTrackClose={() => {
        // eslint-disable-next-line no-console
        console.log(toAlertConfig(form));
      }}
      withTrackCreate={() => {
        // eslint-disable-next-line no-console
        console.log(form.toJS());
      }}
    />
  );
};

export const SimpleAlertConfigDialog = () => {
  return (
    <AlertConfigDialog
      alertConfig={jsSpecificErrorAlertConfig}
      // eslint-disable-next-line no-console
      onClose={alertConfig => console.log(alertConfig)}
      startWithSimpleMode
    />
  );
};

export const SimpleDialogEditModeWithError = () => {
  const [form, setForm] = useState(alertFormDefinition(jsSpecificErrorAlertConfig));

  const dummyTestErrorMessageContainingAskSupport =
    'The maximum number of website alert configurations (9990000) has been reached. Please contact Instana support to request an increase for this limit.'; //.replaceAll('Please contact Instana support to request an increase for this limit.', '');
  const error = enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError({
    message: dummyTestErrorMessageContainingAskSupport
  });

  return (
    <AlertConfigDialogWithThreshold
      messages={[error]}
      form={form}
      updateForm={setForm}
      websiteLabel={'shop'}
      withTrackClose={action('close')}
      withTrackCreate={action('Creact')}
      startWithSimpleMode
      editMode
    />
  );
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

const slownessAlertConfig = Object.freeze({
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
