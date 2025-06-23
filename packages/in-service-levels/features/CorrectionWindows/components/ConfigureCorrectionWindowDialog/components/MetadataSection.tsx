/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { Column, TextArea, TextInput } from '@instana/carbon';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import { isFieldValid, getValidationMessage } from 'in-service-levels/utils/form';
import { t } from 'in-i18n';

export default function MetadataSection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const nameField = form.get('name');
  const descriptionField = form.get('description');

  const isNameValid = isFieldValid(nameField);

  return (
    <>
      <Column lg={16}>
        <TextInput
          labelText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.name')}
          placeholder={t(
            'in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.correctionWindowName'
          )}
          id="correction-window-name"
          value={nameField.value}
          onChange={e => onChange(['name'], () => nameField.setValue(e.currentTarget.value).setTouched(true))}
          invalid={!isNameValid}
          invalidText={getValidationMessage(nameField)}
        />
      </Column>
      <Column lg={16}>
        <TextArea
          labelText={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.description')}
          placeholder={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.description')}
          id="correction-window-description"
          value={descriptionField.value}
          onChange={e =>
            onChange(['description'], () => descriptionField.setValue(e.currentTarget.value).setTouched(true))
          }
        />
      </Column>
    </>
  );
}
