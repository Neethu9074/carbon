/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import AlertConfigDialog from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { generateAlertConfig } from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';

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

export const AdvancedAlertConfigDialog = {
  args: {}
};

export const SimpleAlertConfigDialog = {
  args: {
    startWithSimpleMode: true
  }
};

function failureAlertConfig() {
  return generateAlertConfig();
}
