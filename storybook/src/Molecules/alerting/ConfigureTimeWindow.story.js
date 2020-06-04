import React, { useState } from 'react';

import ConfigureTimeWindow from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureTimeWindow';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import { minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';

export default {
  title: 'Molecules|alerting/interactiveCharts/ConfigureTimeWindow',
  component: ConfigureTimeWindow
};

export const standard = () => {
  const [timeThresholdTimeWindow, setTimeThresholdTimeWindow] = useState(minutesToMillis(1));

  const props = {
    onChange: value => {
      setTimeThresholdTimeWindow(value);
    },
    timeThresholdTimeWindow,
    granularity: minutesToMillis(1),
    timeThresholdType: timeThresholdTypes.userImpactOfViolationsInSequence
  };
  return <ConfigureTimeWindow {...props} />;
};
