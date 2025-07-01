/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

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

export default function EvaluationGranularity({ form, updateForm, thresholdType, titleWidth = '8rem' }) {
  const granularity = form.get('granularity')?.value;

  const marks = getMarksForThresholdType(thresholdType);
  const currentValue = marks.find((i => i.millis === granularity) ?? getDefaultMark(marks, thresholdType)).value;

  return (
    <Section
      title={
        <AlertTypography
          variant="body-regular"
          color="color900"
          content={t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigEvaluationGranularity')}
          noMargin
        />
      }
      titleWidth={titleWidth}
    >
      <DebouncedRestrictedSlider
        marks={marks}
        max={marks[marks.length - 1].value}
        min={0}
        value={currentValue}
        onChange={value => {
          onChangeGranularity(minutes.toMillis(value));
        }}
        valueLabelFormat={val =>
          t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigMinutes', {
            min: val
          })
        }
        key={currentValue}
      />
      <Spacer size="normal" />
      <AlertTypography
        variant="body-small"
        color="color600"
        content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.granularity.description', {
          granularity: currentValue
        })}
        noMargin
      />
    </Section>
  );
  function onChangeGranularity(newGranularity) {
    const oldGranularity = form.get('granularity').value;
    const oldTimeWindow = form.get('timeThreshold').get('timeWindow').value;
    const violations = parseInt(oldTimeWindow / oldGranularity);

    updateForm(
      form
        .updateIn(['granularity'], f => f.setValue(newGranularity).setTouched(true))
        .updateIn(['timeThreshold', 'timeWindow'], f => f.setValue(violations * newGranularity).setTouched(true))
    );
  }
}
