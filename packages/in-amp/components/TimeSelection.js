import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import { formatDurationAccurately } from 'in-services/formatters/date';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import timePresets from 'in-amp/components/timePresets';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { setTimeframe } from 'in-stores/timeline';

export default function TimeSelection() {
  const timeConfig = useTimeConfig();
  const options = timePresets.map(p => ({ value: p, label: p.label }));
  const value = options.find(({ value }) => value.windowSize === timeConfig.windowSize)?.value;

  return (
    <ComboBoxBehavior
      align="bottomRight"
      value={value}
      options={options}
      onChange={({ windowSize, to }) => setTimeframe(windowSize, to)}
      disableAutomaticOptionSorting
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
          {formatDurationAccurately(timeConfig.windowSize, 0, false)}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}
