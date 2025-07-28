/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm, Field } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Stack } from '@instana/components';

//@ts-expect-error
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import AlertTypography from 'in-alerting/components/AlertTypography';

import locals from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInSequence.mless';

const maxTimeWindow = 12;

export default function TimeThresholdViolationsInSequence({
  form,
  updateForm,
  label,
  isCustomInputStyle
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  label: string;
  isCustomInputStyle?: boolean;
}) {
  const granularity = form.get('granularity')?.value;
  const timeThresholdForm = form.get('timeThreshold');
  const timeThresholdTimeWindow = timeThresholdForm.get('timeWindow')?.value;

  return (
    <Stack gap="xsmall">
      <AlertTypography variant={'body-small'} color={'color600'} content={label} />
      <DebouncedInput
        delay={300}
        id="timeWindow"
        name="timeWindowInput"
        data-testid="timeWindowInput"
        type="number"
        min={1}
        max={maxTimeWindow}
        value={timeThresholdTimeWindow / granularity}
        onValueChange={(timeWindowValue: number) => {
          if (timeWindowValue && timeWindowValue > maxTimeWindow) {
            timeWindowValue = maxTimeWindow;
          }
          onChangeTimeWindow(timeWindowValue, form, updateForm);
        }}
        className={classNames({
          [locals.timeWindowInput]: isCustomInputStyle
        })}
      />
      <TouchedMessages field={timeThresholdForm.get('timeWindow')} />
    </Stack>
  );
}

function onChangeTimeWindow(timeWindowValue: number, form: MapForm<any>, updateForm: (form: MapForm<any>) => void) {
  const timeThresholdForm = form.get('timeThreshold');
  const granularity = form.get('granularity')?.value;

  const timeWindow = timeWindowValue * granularity;
  let updatedForm = timeThresholdForm.updateIn(['timeWindow'], (f: Field<number>) =>
    f.setValue(timeWindow).setTouched(true)
  );

  updateForm(form.put('timeThreshold', updatedForm));
}
