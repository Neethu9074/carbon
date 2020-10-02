import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import timePresets from 'in-amp/components/timePresets';

export default function TimeSelection({ windowSize, setWindowSize }) {
  const options = timePresets.map(p => ({ value: p, label: p.label }));
  const value = options.find(({ value }) => value.windowSize === windowSize)?.value;

  return (
    <ComboBoxBehavior
      align="bottomRight"
      value={value}
      options={options}
      onChange={({ windowSize }) => setWindowSize(windowSize)}
      disableAutomaticOptionSorting
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
          {value.label}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}
