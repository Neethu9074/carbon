/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { FormGroup, Label, Select, Spacer } from '@instana/components';

//@ts-expect-error not migrated to typescript yet
import { DescriptionTextWithCurrentTimeZone } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm';
import {
  addFormForExpiryTimeStamp,
  ExpiryOptionType,
  removeFormForExpiryTimeStamp,
  updateExpiresOnFormField
} from 'in-settings/components/ApiTokenExpiration/utils';
import { expirationOptions } from 'in-settings/components/ApiTokenExpiration/ExpirationDateDropdown/expirationOptions';
import ExpiryDateTimePicker from 'in-settings/components/ApiTokenExpiration/ExpiryDateTimePicker/ExpiryDateTimePicker';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { formatDate, formatTime } from 'in-services/formatters/date';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

export interface ExpirationDateDropdownProps {
  id: string;
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
}
const getUtcOffset = (date: number | Date) => formatDateWithActiveLanguage(date, 'xx');

export default function ExpirationDateDropdown({ form, id, setForm }: ExpirationDateDropdownProps) {
  const expiresOn = form.get('expiresOn')?.value;
  const selectedExpiry = (form.get('expiryOption') as Field<ExpiryOptionType>)?.value;

  const addDays = (numberOfDays: number) => {
    const current = new Date();
    const newDate = new Date(current.getTime() + days.toMillis(numberOfDays));
    return newDate.getTime();
  };

  const onChangeExpirationOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedExpiry = e.target.value as ExpiryOptionType;
    const selectedExpiryKey = expirationOptions[e.target.selectedIndex].key;

    let updatedForm = form.updateIn(['expiryOption'], (f: Field<ExpiryOptionType>) => f.setValue(selectedExpiry));

    if (selectedExpiry === 'Custom') {
      updatedForm = addFormForExpiryTimeStamp(updatedForm);
    } else if (selectedExpiry === 'Never') {
      updatedForm = removeFormForExpiryTimeStamp(updatedForm);
      updatedForm = updateExpiresOnFormField(updatedForm, null);
    } else {
      updatedForm = removeFormForExpiryTimeStamp(updatedForm);
      updatedForm = updateExpiresOnFormField(updatedForm, addDays(Number(selectedExpiryKey)));
    }

    setForm(updatedForm);
  };

  const getExpirationHintText = () => {
    let hintText = '';
    if (selectedExpiry === 'Custom') {
      hintText = '';
    } else if (selectedExpiry === 'Never') {
      hintText = t('in-settings:tabs.apiTokenHintTextForNeverExpires');
    } else {
      const dateInput = expiresOn ? formatDate(expiresOn) : '';
      const timeInput = expiresOn ? formatTime(expiresOn) : '00:00';
      hintText = t('in-settings:tabs.apiTokenHintTextForExpiration', {
        expiryDate: dateInput,
        expiryTime: timeInput,
        utcOffSet: getUtcOffset(expiresOn)
      });
    }
    return hintText;
  };

  return (
    <>
      <FormGroup>
        <Label htmlFor={id}>{t('in-settings:tabs.apiTokenExpiration')}</Label>
        <Select useFullWidth onChange={onChangeExpirationOptions} value={selectedExpiry} id={id} title={selectedExpiry}>
          {expirationOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Spacer vertical="xxsmall" />
        <Label>{getExpirationHintText()}</Label>
      </FormGroup>

      {selectedExpiry === 'Custom' && (
        <>
          <ExpiryDateTimePicker form={form} setForm={setForm} />
          <DescriptionTextWithCurrentTimeZone />
        </>
      )}
    </>
  );
}
