import React from 'react';

import { timeShifts, getTimeShiftLabel, translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';

import locals from './TimeShiftDropdown.mless';

export default function TimeShiftDropdown({ value, onChange, timeConfig, disabled }) {
  const options = timeShifts.map(v => ({
    value: v.offset,
    label: renderItemContent(v)
  }));

  const valueLabel = getTimeShiftLabel(translateOffsetToTimeShiftConfig(value, timeConfig));
  return (
    <ComboBoxBehavior
      value={value}
      options={options}
      onChange={value => onChange({ timeShift: value })}
      disableAutomaticOptionSorting
      ariaLabel="Change selected time shift"
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton
          {...elementProps}
          kind="secondary"
          icon="lib_datetime_time"
          expanded={isOpen}
          disabled={disabled}
        >
          Time Shift: {valueLabel}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

function renderItemContent(item) {
  return (
    <div className={locals.overlay}>
      <div className={locals.label}>{item.label}</div>
      <div className={locals.description}>{item.description}</div>
    </div>
  );
}
