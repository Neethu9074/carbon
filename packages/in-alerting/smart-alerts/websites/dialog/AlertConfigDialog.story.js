/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

export default {
  component: AlertConfigDialog,
  argTypes: {
    onClose: {
      action: 'close'
    }
  },
  args: {
    alertConfig: jsSpecificErrorAlertConfig(),
    editMode: false
  }
};

export const AdvancedAlertConfigDialog = {
  args: {}
};

export const SimpleAlertConfigDialog = {
  args: {
    startWithSimpleMode: true
  }
};

function jsSpecificErrorAlertConfig() {
  return Object.freeze({
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
}
