/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Default as alertconfig } from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration.stories';
import AlertConfigDialog from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';

export default {
  component: AlertConfigDialog,
  argTypes: {
    onClose: {
      action: 'close'
    }
  },
  args: {
    alertConfig: failureAlertConfig(),
    editMode: false
  }
};

export const AdvancedDialog = {
  args: {}
};

export const SimpleDialog = {
  args: {
    startWithSimpleMode: true
  }
};

function failureAlertConfig() {
  return alertconfig;
}
