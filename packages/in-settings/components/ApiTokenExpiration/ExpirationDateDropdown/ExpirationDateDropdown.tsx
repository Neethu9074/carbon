/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction } from 'react';
import { Field } from 'formalistic';

import { FormGroup, Label, Select, Spacer } from '@instana/components';

//@ts-expect-error not migrated to typescript yet
import { DescriptionTextWithCurrentTimeZone } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm';
import {
  addFormForExpiryTimeStamp,
  ExpiryOptionType,
  removeFormForExpiryTimeStamp,
  updateExpiresOnFormField
} from 'in-settings/components/ApiTokenExpiration/utils';
import { expirationOptions } from 'in-settings/components/ApiTokenExpiration/ExpirationDateDropdown/expirationOptions';
import ExpiryDateTimePicker from 'in-settings/components/ApiTokenExpiration/ExpiryDateTimePicker/ExpiryDateTimePicker';
import { FormProp, StateProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { formatDate, formatTime } from 'in-services/formatters/date';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

export interface ExpirationDateDropdownProps {
  id: string;
  form: FormProp;
  setState?: Dispatch<SetStateAction<StateProps>>;
}
const getUtcOffset = (date: number | Date) => formatDateWithActiveLanguage(date, 'xx');

export default function ExpirationDateDropdown({ form, id, setState }: ExpirationDateDropdownProps) {
  const expiresOn = form.get('expiresOn')?.value;
  const selectedExpiry = (form.get('expiryOption') as Field<ExpiryOptionType>)?.value;

  const addDays = (numberOfDays: number) => {
    const current = new Date();
    const newDate = new Date(current.getTime() + days.toMillis(numberOfDays));
    return newDate.getTime();
  };

  const onChangeExpirationOptions = (selectedExpiry: ExpiryOptionType) => {
    let updatedForm = form.updateIn(['expiryOption'], (f: Field<ExpiryOptionType>) => f.setValue(selectedExpiry));

    if (!setState) {
      return;
    }

    if (selectedExpiry === 'Custom') {
      updatedForm = addFormForExpiryTimeStamp(updatedForm);
    } else if (selectedExpiry === 'Never') {
      updatedForm = removeFormForExpiryTimeStamp(updatedForm);
      updatedForm = updateExpiresOnFormField(updatedForm, null);
    } else {
      updatedForm = removeFormForExpiryTimeStamp(updatedForm);
      updatedForm = updateExpiresOnFormField(updatedForm, addDays(Number(selectedExpiry)));
    }

    setState(prevState => ({
      ...prevState,
      form: updatedForm
    }));
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
        <Label htmlFor="api-token-expiration">{t('in-settings:tabs.apiTokenExpiration')}</Label>
        <Select
          useFullWidth
          onChange={e => onChangeExpirationOptions(e.target.value as ExpiryOptionType)}
          value={selectedExpiry}
          id={id}
          title=""
        >
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
          <ExpiryDateTimePicker form={form} setState={setState} />
          <DescriptionTextWithCurrentTimeZone />
        </>
      )}
    </>
  );
}
