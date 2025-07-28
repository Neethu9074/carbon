/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

import {
  getMarksForThresholdType,
  getDefaultMark
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureGranularity';
import TimeThresholdViolationsInSequence from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInSequence';
import { Marks } from 'in-alerting/smart-alerts/components/tearSheet/ConfigureTimeThreshold';
//@ts-expect-error
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

export default function TimeThresholdViolationsInPeriod({
  form,
  updateForm
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}) {
  const granularity = form.get('granularity')?.value;
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;

  const timeThresholdForm = form.get('timeThreshold');
  const timeThresholdTimeWindow = timeThresholdForm.get('timeWindow')?.value;
  const maxViolations = Math.round(timeThresholdTimeWindow / granularity);
  const timeThresholdViolations = timeThresholdForm.get('violations')?.value;

  const marks = getMarksForThresholdType(thresholdType);
  const foundMark = marks.find((i: Marks) => i.millis === granularity) ?? getDefaultMark(marks, thresholdType);
  const currentValue = foundMark.value;

  return (
    <Stack direction="horizontal">
      <Stack gap="xsmall">
        <AlertTypography
          variant={'body-small'}
          color={'color600'}
          content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.violationsOccurrenceLabel')}
        />
        <DebouncedInput
          delay={300}
          id="violationCount"
          data-testid="violationCountInput"
          name="violationCountInput"
          type="number"
          min={1}
          max={maxViolations}
          onValueChange={(thresholdViolation: number) => {
            if (thresholdViolation && thresholdViolation > maxViolations) {
              thresholdViolation = maxViolations;
            }
            onChangeViolationsInPeriod(thresholdViolation, form, updateForm);
          }}
          value={timeThresholdViolations}
        />
        <TouchedMessages field={timeThresholdForm?.get('violations')} />
      </Stack>
      <Stack>
        <Spacer vertical="normal" />
        <AlertTypography
          variant="body-small"
          color="color600"
          content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.violationAcross')}
        />
      </Stack>
      <TimeThresholdViolationsInSequence
        form={form}
        updateForm={updateForm}
        label={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.bucketsOfTime', {
          granularity: currentValue
        })}
      />
    </Stack>
  );
}

function onChangeViolationsInPeriod(violations: number, form: MapForm<any>, updateForm: (form: MapForm<any>) => void) {
  const timeThresholdForm = form.get('timeThreshold');
  let updatedForm = timeThresholdForm.updateIn(['violations'], (f: Field<number>) =>
    f.setValue(violations).setTouched(true)
  );
  updateForm(form.put('timeThreshold', updatedForm));
}
