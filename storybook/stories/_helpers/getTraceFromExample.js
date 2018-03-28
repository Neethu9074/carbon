import { select } from '@storybook/addon-knobs/react';

import { enrichWithJSONInput } from './json';
import traceExamples from './traceExamples';

export default function getTraceFromExamples() {
  const options = {
    custom: 'custom'
  };
  const exampleKeys = Object.keys(traceExamples);
  for (let i = 0; i < exampleKeys.length; i++) {
    const key = exampleKeys[i];
    options[key] = key;
  }

  let value = select('Traces', options, 'custom', 'trace-selection');
  if (value === 'custom') {
    value = enrichWithJSONInput();
    if (!value) {
      return null;
    }
  } else {
    value = traceExamples[value];
  }
  return value;
}
