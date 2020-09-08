import React from 'react';

import { track, TIME_WINDOW_SIZE_VIA_PICKER } from 'in-services/tracking/tracking';
import { formatDurationAccurately } from 'in-services/formatters/date';
import timePresets from 'in-amp/components/timePresets';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Dropdown from 'in-new-components/Dropdown';
import { setTimeframe } from 'in-stores/timeline';

import locals from './Usage.mless';

export default function TimeSelection() {
  const timeConfig = useTimeConfig();

  return (
    <Dropdown
      className={locals.dropdown}
      label={formatDurationAccurately(timeConfig.windowSize)}
      asSimpleDropdown
      items={timePresets}
      onChange={({ windowSize, to }) => {
        setTimeframe(windowSize, to);
        track(TIME_WINDOW_SIZE_VIA_PICKER);
      }}
    />
  );
}
