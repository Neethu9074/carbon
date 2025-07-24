/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { formattedTimezoneList } from 'in-service-levels/utils/timezone';
import type { ComboBoxOption } from 'in-service-levels/utils/timezone';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from './TimezoneSelector.mless';

const timezoneList = formattedTimezoneList;
const emptyTimezoneList: ComboBoxOption[] = [];

export function TimezoneList() {
  const { form, onChange } = useContext(SloFormContext);
  const timezoneField = form.getIn(['objective', 'timezone']);
  const bindTimezoneField = form.getIn(['objective', 'bindTimezone']);

  return (
    <div className={locals.selectField}>
      <ComboBox
        id="slo-objective-timezone-selector"
        className={locals.selectFieldSize}
        placeholder={t('in-service-levels:createSloDialog.selectTimezoneMessage')}
        value={timezoneField.value}
        disabled={!bindTimezoneField.value}
        options={bindTimezoneField.value ? timezoneList : emptyTimezoneList}
        onChange={selectedOption => {
          const value = selectedOption ? (selectedOption as any).value : '';
          onChange(['objective', 'timezone'], () => timezoneField.setValue(value).setTouched(true));
        }}
      />
    </div>
  );
}

export default TimezoneList;
