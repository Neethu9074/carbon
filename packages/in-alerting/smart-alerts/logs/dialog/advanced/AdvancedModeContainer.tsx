/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { isCustomPayloadValidOrUntouched } from 'in-alerting/smart-alerts/components/utils/formUtils';
import StepsContainer from 'in-components/StepsContainer';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props: AlertConfigDialogPresenterProps & MainDialogControl) {
  const { form } = props;

  return (
    <StepsContainer
      messages={[]}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.scope.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.scope.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.threshold.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.threshold.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.timeThreshold.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.timeThreshold.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.alertChannel.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.alertChannel.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.customPayloads.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.customPayloads.title'),
          valid: isCustomPayloadValidOrUntouched(form),
          content: <></>
        }
      ]}
    />
  );
}
