/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Router } from 'react-router-dom';
import React from 'react';

import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/dialog/SmartAlertConfigDialogWrapper';
import { someLogsFormData } from 'in-alerting/smart-alerts/applications/dialog/advanced/stories/formSampleData';
import { generateAlertConfig } from 'in-alerting/smart-alerts/applications/components/CreateSmartAlert';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import history from 'in-stores/navigation/history';
import { noop } from 'in-services/util/function';

// for enabling the use of useLocation-hook
const routerDecorator = Story => (
  <Router history={history}>
    <Story />
  </Router>
);

export default {
  decorators: [routerDecorator],
  component: SmartAlertConfigDialogWrapper,
  parameters: {
    chromatic: { disable: true }
  }
};

export const AdvancedAlertConfigDialog = () => {
  const { applicationId = 'applicationId' } = {};

  return (
    <SmartAlertConfigDialogWrapper
      applicationLabel={'applicationLabel'}
      alertConfig={generateAlertConfig({
        applicationId,
        boundaryScope: 'urlBoundaryScope'
      })}
      editMode
      onClose={noop}
    />
  );
};
export const AdvancedDialogWithInvalidLogs = () => {
  const { applicationId = 'applicationId' } = {};

  const logsFormData = someLogsFormData();
  const alertConfig = {
    ...generateAlertConfig({
      applicationId,
      boundaryScope: 'urlBoundaryScope'
    }),
    ...logsFormData,
    rule: {
      alertType: 'logs'
      // without: message
    },
    threshold: {
      type: STATIC_THRESHOLD,
      operator: '>'
      // without: value
    }
  };
  return (
    <SmartAlertConfigDialogWrapper
      applicationLabel={'applicationLabel'}
      alertConfig={alertConfig}
      editMode
      onClose={noop}
    />
  );
};

export const SimpleAlertConfigDialog = () => {
  const { applicationId = 'applicationId' } = {};

  return (
    <SmartAlertConfigDialogWrapper
      applicationLabel={'applicationLabel'}
      alertConfig={generateAlertConfig({
        applicationId,
        boundaryScope: 'urlBoundaryScope'
      })}
      // eslint-disable-next-line no-console
      onClose={alertConfig => console.log(alertConfig)}
      startWithSimpleMode
    />
  );
};
