/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3.mless';

export default function SimpleAlertConfigDialogStep3(props) {
  return (
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.components.smartAlertDialog.simpleAlertConfigDialogStep3Headline')}
    >
      <div className={locals.alertChannelsContainer}>
        <ConfigureAlertChannel {...props} />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
