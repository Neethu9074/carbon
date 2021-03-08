/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import ConfigureTimeWindow from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/ConfigureTimeWindow';
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
