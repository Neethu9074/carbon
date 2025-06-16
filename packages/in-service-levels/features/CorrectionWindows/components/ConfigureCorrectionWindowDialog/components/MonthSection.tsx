/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { Column, Dropdown } from '@instana/carbon';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import { monthOptions } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';
import { isFieldValid, getValidationMessage } from 'in-service-levels/utils/form';
import { t } from 'in-i18n';

export default function MonthSection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
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
        label={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.select')}
        titleText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.month')}
        id="correction-window-month"
        invalid={!isMonthFieldValid}
        invalidText={getValidationMessage(monthField)}
        items={monthOptions}
        selectedItem={monthOptions.find(({ value }) => value === monthField.value)}
      />
    </Column>
  );
}
