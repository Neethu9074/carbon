import React from 'react';

import TimeInput from 'in-new-components/TimeInput';

export default {
  title: 'Molecules|TimeInput',
  component: TimeInput
};

// eslint-disable-next-line no-console
export const timeInput = () => <TimeInput onChange={value => console.log({ value })} />;
