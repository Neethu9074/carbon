/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { DistinctSlider } from '@instana/components';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3.mless';

export default function SimpleModeDialogThreshold(props: AlertConfigDialogPresenterProps & MainDialogControl) {
  const formatPercent = (value: number) => `${value}`;
  const labeledTicks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => ({ value, label: formatPercent(value) }));
  const { form, updateForm } = props;
  const timeThresholdForm = form.get('timeThreshold') as MapForm;
  const violationsCount = (timeThresholdForm.get('violationsCount') as Field<number>).value;

  function onChangeViolationsInPeriod(_event: Event, value: number | number[]) {
    //@ts-expect-error
    updateForm(form.updateIn(['timeThreshold', 'violationsCount'], f => f.setValue(value).setTouched(true)));
  }
  return (
    <SimpleModeStepContentWrapper headline={t('in-alerting:smartAlerts.synthetics.simple.thresholdTitle')}>
      <div className={locals.alertChannelsContainer}>
        <DistinctSlider
          valueLabelDisplay="auto"
          valueLabelFormat={formatPercent}
          marks={labeledTicks}
          min={1}
          max={10}
          step={1}
          value={violationsCount}
          onChange={onChangeViolationsInPeriod}
        />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
