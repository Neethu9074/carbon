/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import TimeInput from 'in-components/TimeInput/TimeInput';

export default {
  component: TimeInput
};

const fixedTime = '07:50:00';

export const TimeInputDefault = () => {
  const [value, setValue] = useState(fixedTime);
  return (
    <div>
      <div>
        <TimeInput
          value={value}
          onChange={val => {
            setValue(val);
          }}
        />
      </div>
      <div>{`Time selected: ${value}`}</div>
    </div>
  );
};

export const TimeInputWithError = () => {
  const [value, setValue] = useState(fixedTime);
  return <TimeInput value={value} onChange={value => setValue(value)} hasError />;
};
