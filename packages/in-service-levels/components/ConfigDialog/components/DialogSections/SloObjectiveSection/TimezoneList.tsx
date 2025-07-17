/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useContext } from 'react';

import { getIntlDateFormatter } from '@instana/format-date';

// @ts-ignore
// eslint-disable-next-line no-restricted-imports
import moment from 'in-services/moment-timezone';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { compareIgnoreCase } from 'in-services/util/string';
import { compare } from 'in-services/util/number';
import ComboBox from 'in-components/ComboBox';

import locals from './TimezoneSelector.mless';

interface TimezoneOption {
  name: string;
  offset: number;
  formattedOffset: string;
}

interface ComboBoxOption {
  label: string;
  value: string;
}

function isSupportedTimezone(timezone: string): boolean {
  try {
    getIntlDateFormatter({
      timeZone: timezone,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    });
    return true;
  } catch (e) {
    return false;
  }
}

export function TimezoneList() {
  const { form, onChange } = useContext(SloFormContext);
  const timezoneField = form.getIn(['objective', 'timezone']);
  const bindTimezoneField = form.getIn(['objective', 'bindTimezone']);
  const emptyTimezoneList: ComboBoxOption[] = [];

  const supportedTimezones = useMemo<TimezoneOption[]>(
    () =>
      moment.tz
        .names()
        .filter(isSupportedTimezone)
        .map((name: string) => {
          const timezone = moment.tz(name);
          return {
            name,
            offset: timezone._offset,
            formattedOffset: timezone.format('Z')
          };
        })
        .sort((a: TimezoneOption, b: TimezoneOption) => {
          let result = compare(a.offset, b.offset);
          if (result === 0) {
            result = compareIgnoreCase(a.name, b.name);
          }
          return result;
        }),
    []
  );

  const timezoneList = useMemo<ComboBoxOption[]>(() => {
    return supportedTimezones.map(({ name, formattedOffset }: TimezoneOption) => ({
      label: `UTC ${formattedOffset} - ${name}`,
      value: `UTC ${formattedOffset} - ${name}`
    }));
  }, [supportedTimezones]);

  return (
    <div className={locals.selectField}>
      <ComboBox
        id="timezone-selector"
        className={locals.selectFieldSize}
        placeholder="Select time zone"
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
