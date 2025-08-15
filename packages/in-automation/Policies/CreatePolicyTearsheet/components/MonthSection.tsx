/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Column, Dropdown } from '@instana/carbon';

import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import { monthOptions } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { getValidationMessage, isFieldValid } from 'in-automation/utils/form';
import { t } from 'in-i18n';

export default function MonthSection() {
  const { form, onChange } = usePolicyFormContext();
  const monthField = form.getIn(['schedule', 'recurrence', 'month']);

  const isMonthFieldValid = isFieldValid(monthField);

  return (
    <Column lg={4} md={4}>
      <Dropdown
        onChange={({ selectedItem }) => {
          onChange(['schedule', 'recurrence', 'month'], () =>
            monthField.setValue(selectedItem?.value).setTouched(true)
          );
        }}
        label={t('in-automation:policyCreateTearsheet.select')}
        titleText={t('in-automation:policyCreateTearsheet.month')}
        id="correction-window-month"
        invalid={!isMonthFieldValid}
        invalidText={getValidationMessage(monthField)}
        items={monthOptions}
        selectedItem={monthOptions.find(({ value }) => value === monthField.value)}
      />
    </Column>
  );
}
