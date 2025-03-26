/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import SimpleModeDialogThreshold from 'in-alerting/smart-alerts/synthetics/dialog/simple/SimpleModeDialogThreshold';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import generateAlertConfig from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';

export default { component: SimpleModeDialogThreshold };
const failureAlertConfig = Object.freeze(generateAlertConfig());

export const Threshold = (
  args: AlertConfigDialogPresenterProps &
    MainDialogControl & {
      subtitle?: string;
      subTitleToolTipText?: string;
    }
) => {
  const [form, updateForm] = useState(alertFormDefinition(failureAlertConfig));

  return <SimpleModeDialogThreshold {...args} form={form} updateForm={updateForm} />;
};
