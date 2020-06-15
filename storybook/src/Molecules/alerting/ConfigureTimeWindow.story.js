import React, { useState } from 'react';

import ConfigureTimeWindow from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureTimeWindow';
import { minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';

export default {
  title: 'Molecules|alerting/interactiveCharts/ConfigureTimeWindow',
  component: ConfigureTimeWindow
};

export const standard = () => {
  const [timeThresholdTimeWindow, setTimeThresholdTimeWindow] = useState(minutesToMillis(5));

  const props = {
    label: 'Number of consecutive violations:',
    onChange: value => {
      setTimeThresholdTimeWindow(value);
    },
    timeThresholdTimeWindow,
    granularity: minutesToMillis(3)
  };
  return <ConfigureTimeWindow {...props} />;
};
