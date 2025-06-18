/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { Column, NumberInput } from '@instana/carbon';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import { isFieldValid, getValidationMessage } from 'in-service-levels/utils/form';
import { t } from 'in-i18n';

export default function DateSection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const dateField = form.getIn(['schedule', 'recurrence', 'date']);

  const isDateFieldValid = isFieldValid(dateField);

  return (
    <Column lg={5}>
      <NumberInput
        label={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.date')}
        id="correction-window-monthly-date"
        min={0}
        max={31}
        invalid={!isDateFieldValid}
        invalidText={getValidationMessage(dateField)}
        value={dateField.value || 0}
        onChange={(_, { value }) =>
          onChange(['schedule', 'recurrence', 'date'], () => dateField.setValue(+value).setTouched(true))
        }
      />
    </Column>
  );
}
