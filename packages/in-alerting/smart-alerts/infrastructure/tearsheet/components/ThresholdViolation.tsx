/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import {
  getMarksForThresholdType,
  getDefaultMark
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureGranularity';
import { Marks } from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep2';
//@ts-expect-error
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from './ThresholdViolation.mless';

const maxTimeWindow = 12;

export default function ThresholdViolation({
  form,
  oneMinuteGranularityAllowed,
  updateForm
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  oneMinuteGranularityAllowed: boolean;
}) {
  const granularity = form.get('granularity')?.value;
  const thresholdType = form.get('threshold').get('type')?.value;

  const timeThresholdForm = form.get('timeThreshold');
  const timeThresholdTimeWindow = timeThresholdForm.get('timeWindow')?.value;

  const marks = getMarksForThresholdType(thresholdType, oneMinuteGranularityAllowed);
  const foundMark = marks.find((i: Marks) => i.millis === granularity) ?? getDefaultMark(marks, thresholdType);
  const currentValue = foundMark.value;

  return (
    <Stack direction="vertical" gap="xsmall" align="start">
      <AlertTypography
        variant="body-regular"
        color="color900"
        content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAfter')}
      />
      <div className={locals.fullWidthWrapper}>
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
        />

        <AlertTypography
          variant={'body-small'}
          color={'color600'}
          content={t(
            'in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfConsecutiveViolationsPostLabel',
            {
              granularity: currentValue
            }
          )}
          noMargin
        />
      </div>
      <TouchedMessages field={timeThresholdForm.get('timeWindow')} />
      {/* </Section> */}
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
