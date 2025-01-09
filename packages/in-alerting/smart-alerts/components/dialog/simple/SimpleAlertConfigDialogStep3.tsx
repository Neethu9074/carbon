/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ConfigureAlertChannelMT from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel';
import { ConfigureAlertChannelProps } from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3.mless';

export default function SimpleAlertConfigDialogStep3(props: ConfigureAlertChannelProps) {
  const { alertChannelPerSeverityEnabled } = props;
  return (
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.components.smartAlertDialog.simpleAlertConfigDialogStep3Headline')}
    >
      <div className={locals.alertChannelsContainer}>
        <>
          {alertChannelPerSeverityEnabled ? (
            <ConfigureAlertChannelMT {...props} />
          ) : (
            <ConfigureAlertChannel {...props} />
          )}
        </>
      </div>
    </SimpleModeStepContentWrapper>
  );
}
