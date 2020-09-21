import React from 'react';

import {
  urlParameter,
  timeShifts,
  previousHourTimeShift,
  getTimeShiftLabel,
  translateOffsetToTimeShiftConfig
} from 'in-stores/time/shifting';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';

import locals from './TimeShiftDropdown.mless';

const urlStateDefinition = {
  bind: [urlParameter]
};

export default function TimeShiftDropdown({ disabled, onChange: onTimeShiftChange }) {
  const timeConfig = useTimeConfig();
  const [{ timeShiftOffset }, onChange] = useUrlState(urlStateDefinition);

  const options = timeShifts
    .filter(({ disallowSelection, offset }) => disallowSelection !== true && offset !== previousHourTimeShift.offset)
    .map(v => ({
      value: v.offset,
      label: renderItemContent(v)
    }));

  const valueLabel = getTimeShiftLabel(translateOffsetToTimeShiftConfig(timeShiftOffset, timeConfig));
  return (
    <ComboBoxBehavior
      value={timeShiftOffset}
      options={options}
      onChange={timeShiftOffset => {
        onChange({ timeShiftOffset });
        onTimeShiftChange(timeShiftOffset);
      }}
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
