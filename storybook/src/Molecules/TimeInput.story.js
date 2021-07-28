/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { fixedTimestamp } from '../util/generateMetrics';
import TimeInput from 'in-components/TimeInput';

export default {
  title: 'Molecules|TimeInput',
  component: TimeInput
};

export const TimeInputDefault = () => {
  const [value, setValue] = useState(fixedTimestamp);
  return <TimeInput value={value} onChange={value => setValue(value)} />;
};

export const TimeInputWithError = () => {
  const [value, setValue] = useState(fixedTimestamp);
  return <TimeInput value={value} onChange={value => setValue(value)} hasError />;
};
