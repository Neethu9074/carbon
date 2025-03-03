/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { DistinctSlider } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/tearsheet/components/TimeThresholdPicker.mless';

interface TimeThresholdPickerPros {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function TimeThresholdPicker({ form, updateForm }: TimeThresholdPickerPros) {
  const formatLabel = (value: number) =>
    t('in-alerting:smartAlerts.synthetics.simple.slider.failuresWithCount', {
      count: value
    });

  const labeledTicks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => ({ value, label: value }));

  const timeThresholdForm = form.get('timeThreshold') as MapForm<any>;
  const violationsCount = (timeThresholdForm.get('violationsCount') as Field<number>).value;

  function onChangeViolationsInPeriod(_event: Event, value: number | number[]) {
    updateForm(
      form.updateIn(['timeThreshold', 'violationsCount'], f =>
        (f as Field<number | number[]>).setValue(value).setTouched(true)
      )
    );
  }
  return (
    <div className={locals.sliderContainer}>
      <DistinctSlider
        valueLabelFormat={formatLabel}
        marks={labeledTicks}
        min={1}
        max={10}
        step={1}
        value={violationsCount}
        onChange={onChangeViolationsInPeriod}
      />
    </div>
  );
}
