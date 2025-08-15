/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Column, Dropdown, NumberInput } from '@instana/carbon';
import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import { getValidationMessage } from 'in-automation/utils/form';
import { t } from 'in-i18n';
import { isFieldValid } from 'in-service-levels/utils/form';

const dailyIntervalOption = {
  value: 'days',
  label: t('in-automation:policyCreateTearsheet.intervalDropdown.days')
};

export default function DailySection() {
  const { form, onChange } = usePolicyFormContext();
  const intervalField = form.getIn(['schedule', 'recurrence', 'interval']);
  return (
    <>
      <Column lg={5} md={5}>
        <NumberInput
          label={t('in-automation:policyCreateTearsheet.repeatEvery')}
          id="policy-schedule-recurrence-interval"
          min={0}
          invalid={!isFieldValid(intervalField)}
          invalidText={getValidationMessage(intervalField)}
          max={31}
          value={intervalField.value}
          onChange={(_, { value }) => {
            onChange(['schedule', 'recurrence', 'interval'], () =>
              intervalField.setValue(Number(value)).setTouched(true)
            );
          }}
        />
      </Column>
      <Column lg={4} md={4}>
        <Dropdown
          label=""
          titleText={<wbr />}
          id="policy-sceduling-interval-unit"
          items={[dailyIntervalOption]}
          readOnly
          disabled
          selectedItem={dailyIntervalOption}
        />
      </Column>
    </>
  );
}
