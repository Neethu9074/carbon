/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Column, RadioButton, RadioButtonGroup } from '@instana/carbon';

import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import { ONE_TIME } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { RepeatType } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';
import { t } from 'in-i18n';

export default function RepeatTypeSection() {
  const { form, setForm } = usePolicyFormContext();
  const scheduleForm = form.get('schedule');
  const repeatTypeField = scheduleForm.getIn(['recurrence', 'repeatType']);
  const frequencyField = scheduleForm.get('frequency');

  if (frequencyField.value === ONE_TIME) return null;

  return (
    <Column lg={16}>
      <RadioButtonGroup
        name="policy-schedule-repeat-type"
        legendText={t('in-automation:general.frequency.label', {
          context: frequencyField.value.toString()
        })}
        orientation="horizontal"
        value={repeatTypeField.value}
        defaultSelected={repeatTypeField.value}
        onChange={value =>
          setForm(form =>
            form.updateIn(['schedule', 'recurrence', 'repeatType'], () =>
              repeatTypeField.setValue(value as RepeatType).setTouched(true)
            )
          )
        }
      >
        <RadioButton labelText={t('in-automation:policyCreateTearsheet.byDate')} value={'date' as RepeatType} />
        <RadioButton labelText={t('in-automation:policyCreateTearsheet.byDay')} value={'day' as RepeatType} />
      </RadioButtonGroup>
    </Column>
  );
}
