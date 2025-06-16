/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { Column, RadioButton, RadioButtonGroup } from '@instana/carbon';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import { RepeatType } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import { ONE_TIME } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';
import { t } from 'in-i18n';

export default function RepeatTypeSection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const scheduleForm = form.get('schedule');
  const repeatTypeField = scheduleForm.getIn(['recurrence', 'repeatType']);
  const frequencyField = scheduleForm.get('frequency');

  if (frequencyField.value === ONE_TIME) return null;

  return (
    <Column lg={16}>
      <RadioButtonGroup
        name="correction-window-repeat-type"
        legendText={t('in-service-levels:general.frequency.label', {
          context: frequencyField.value.toString()
        })}
        orientation="horizontal"
        value={repeatTypeField.value}
        defaultSelected={repeatTypeField.value}
        onChange={value =>
          onChange(['schedule', 'recurrence', 'repeatType'], () =>
            repeatTypeField.setValue(value as RepeatType).setTouched(true)
          )
        }
      >
        <RadioButton
          labelText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.byDate')}
          value={'date' satisfies RepeatType}
        />
        <RadioButton
          labelText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.byDay')}
          value={'day' satisfies RepeatType}
        />
      </RadioButtonGroup>
    </Column>
  );
}
