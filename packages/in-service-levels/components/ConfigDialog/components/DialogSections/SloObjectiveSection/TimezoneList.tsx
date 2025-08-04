/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { formattedTimezoneList } from 'in-service-levels/utils/timezone';
import type { ComboBoxOption } from 'in-service-levels/utils/timezone';
import type { Option } from 'in-components/ComboBox';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from './TimezoneSelector.mless';

const timezoneList = formattedTimezoneList;
const emptyTimezoneList: ComboBoxOption[] = [];

export function TimezoneList() {
  const { form, onChange } = useContext(SloFormContext);
  const zoneField = form.getIn(['objective', 'timezone', 'zone']);
  const bindField = form.getIn(['objective', 'timezone', 'bind']);

  return (
    <div className={locals.selectField}>
      <ComboBox
        id="slo-objective-timezone-selector"
        className={locals.selectFieldSize}
        placeholder={t('in-service-levels:createSloDialog.selectTimezoneMessage')}
        value={zoneField.value}
        disabled={!bindField.value}
        options={bindField.value ? timezoneList : emptyTimezoneList}
        onChange={selectedOption => {
          const value = selectedOption ? (selectedOption as Option).value : '';
          onChange(['objective', 'timezone', 'zone'], () => zoneField.setValue(value).setTouched(true));
        }}
      />
    </div>
  );
}

export default TimezoneList;
