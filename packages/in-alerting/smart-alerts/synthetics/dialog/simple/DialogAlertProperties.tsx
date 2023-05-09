/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SyntheticsAlertProperties from 'in-alerting/smart-alerts/synthetics/dialog/SyntheticsAlertProperties';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3.mless';

export default function DialogAlertProperties(props: AlertConfigDialogPresenterProps & MainDialogControl) {
  const { form, onChange } = props;
  return (
    <SimpleModeStepContentWrapper headline={t('in-alerting:smartAlerts.synthetics.simple.alertDialogHeadline')}>
      <div className={locals.alertChannelsContainer}>
        <SyntheticsAlertProperties form={form} onChange={onChange} />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
