import React, { useState } from 'react';

import ConfigureTimeWindow from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureTimeWindow';
import { minutes } from 'in-services/time';

export default {
  title: 'Molecules|alerting/interactiveCharts/ConfigureTimeWindow',
  component: ConfigureTimeWindow
};

export const standard = () => {
  const [timeThresholdTimeWindow, setTimeThresholdTimeWindow] = useState(minutes.toMillis(5));

  const props = {
    label: 'Number of consecutive violations:',
    onChange: value => {
      setTimeThresholdTimeWindow(value);
    },
    timeThresholdTimeWindow,
    granularity: minutes.toMillis(3)
  };
  return <ConfigureTimeWindow {...props} />;
};
