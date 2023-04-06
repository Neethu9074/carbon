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
import DialogAlertProperties from 'in-alerting/smart-alerts/synthetics/dialog/simple/DialogAlertProperties';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import generateAlertConfig from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';

export default { component: DialogAlertProperties };
const failureAlertConfig = Object.freeze(generateAlertConfig());

export const AlertProperties = (args: AlertConfigDialogPresenterProps & MainDialogControl) => {
  const [form, updateForm] = useState(alertFormDefinition(failureAlertConfig));

  return (
    <DialogAlertProperties
      {...args}
      form={form}
      onChange={(path, updater) => {
        // @ts-expect-error ts has problems with nested updates if on MapForm<any> since the form structure is not known
        updateForm(form.updateIn(path, updater));
      }}
    />
  );
};
