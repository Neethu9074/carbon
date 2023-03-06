/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item } from 'formalistic';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { SliderState } from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import ConfigureAlertTest from 'in-alerting/smart-alerts/synthetics/components/ConfigureAlertTest';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/dialog/simple/SimpleAlertConfigDialogStep1.mless';

export interface ConfigureAlertTestProps {
  form: MapForm;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig: (state: { title: string | null; onClose: (() => void) | null }) => void;
  numberOfAlertChannelListRows?: number;
}

export default function SimpleAlertConfigDialogStep1(props: ConfigureAlertTestProps) {
  return (
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.synthetics.simple.simpleAlertConfigDialogStep1Headline')}
    >
      <div className={locals.alertTestsContainer}>{<ConfigureAlertTest {...props} />}</div>
    </SimpleModeStepContentWrapper>
  );
}
