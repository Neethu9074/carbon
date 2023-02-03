/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import ConfigureTimeWindow from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureTimeWindow';
import { minutes } from 'in-services/time';

export default {
  component: ConfigureTimeWindow
};

export const Standard = () => {
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
