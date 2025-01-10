/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

import { Spacer } from '@instana/components';

import {
  getMarksForThresholdType,
  getDefaultMark
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureGranularity';
import DebouncedRestrictedSlider from 'in-components/Slider/DebouncedRestrictedSlider';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

interface Marks {
  label: string;
  millis: number;
  value: number;
}

export default function EvaluationWindow({
  form,
  oneMinuteGranularityAllowed,
  updateForm
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  oneMinuteGranularityAllowed: boolean;
}) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const granularity = form.get('granularity')?.value;

  const marks = getMarksForThresholdType(thresholdType, oneMinuteGranularityAllowed);
  const foundMark = marks.find((i: Marks) => i.millis === granularity) ?? getDefaultMark(marks, thresholdType);
  const currentValue = foundMark.value;

  return (
    <Section
      title={
        <AlertTypography
          variant="body-regular"
          color="color900"
          content={t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigEvaluationGranularity')}
        />
      }
      titleWidth="8rem"
    >
      <div style={{ width: '100%' }}>
        <DebouncedRestrictedSlider
          marks={marks}
          max={marks[marks.length - 1].value}
          min={0}
          value={currentValue}
          onChange={value => {
            onChangeGranularity(minutes.toMillis(value), form, updateForm);
          }}
          valueLabelDisplay="off"
        />
        <Spacer size="normal" />
        <AlertTypography
          variant="body-small"
          color="color600"
          content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.granularity.description', {
            granularity: currentValue
          })}
        />
      </div>
    </Section>
  );
}

function onChangeGranularity(newGranularity: number, form: MapForm<any>, updateForm: (form: MapForm<any>) => void) {
  const oldGranularity = form.get('granularity').value;
  const oldTimeWindow = form.get('timeThreshold').get('timeWindow').value;

  const calculatedViolation = (oldTimeWindow / oldGranularity).toString();

  const violations = parseInt(calculatedViolation);

  updateForm(
    form
      .updateIn(['granularity'], f => f.setValue(newGranularity).setTouched(true))
      .updateIn(['timeThreshold', 'timeWindow'], f =>
        (f as Field<number>).setValue(violations * newGranularity).setTouched(true)
      )
  );
}
