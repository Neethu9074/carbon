/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { formatDurationAccurately } from 'in-services/formatters/date';
import { timeConfig$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    duration: timeConfig$.map(timeConfig => formatDurationAccurately(timeConfig.windowSize)).distinct()
  },
  function TimeWindowSizeLabel({ prefix, duration }) {
    prefix = prefix || '';
    return <span>{prefix + duration}</span>;
  }
);
