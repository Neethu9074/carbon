/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import { enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/websites/alertConfigDialogWithThreshold/AlertConfigDialogWithThreshold';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import alertFormDefinition from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import WebsiteAlertConfig from 'in-alerting/smart-alerts/websites/AlertConfigDialog';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

export default {
  title: 'Templates|website/alerting/AlertConfigDialog',
  component: AlertConfigDialogWithThreshold
};

export const AlertConfigDialog = () => {
  const [form, updateForm] = useState(alertFormDefinition(getFormData()));

  return (
    <AlertConfigDialogWithThreshold
      updateForm={updateForm}
      alertConfig={alertFormDefinition(getFormData())}
      form={form}
      withTrackClose={action('close')}
      withTrackCreate={action('Creact')}
    />
  );
};

export const SimpleAlertConfigDialog = () => {
  return <WebsiteAlertConfig alertConfig={getFormData()} onClose={action('close')} startWithSimpleMode />;
};

export const SimpleDialogEditModeWithError = () => {
  const [form, setForm] = useState(alertFormDefinition(getFormData()));

  const dummyTestErrorMessageContainingAskSupport =
    'The maximum number of website alert configurations (9990000) has been reached. Please contact Instana support to request an increase for this limit.'; //.replaceAll('Please contact Instana support to request an increase for this limit.', '');
  const error = enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError({
    message: dummyTestErrorMessageContainingAskSupport
  });

  return (
    <AlertConfigDialogWithThreshold
      error={error}
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

function getFormData() {
  return {
    id: '<generated server side',
    name: 'JS Specific errors example',
    description: 'Foobar',
    severity: 5,
    triggering: false,
    tagFilterExpression: emptyTagFilterExpression,
    rule: {
      alertType: 'specificJsError',
      matchingOperator: 'CONTAINS',
      value: 'unknown error'
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
  };
}
