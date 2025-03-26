/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import RegexInput from 'in-components/RegexInput';

export default {
  component: RegexInput
};

export const Default = () => {
  const [value, setValue] = useState('');
  return <RegexInput value={value} onChange={setValue} />;
};
