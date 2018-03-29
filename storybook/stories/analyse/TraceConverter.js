import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import { withState } from 'recompose';
import React from 'react';

import { deepFreeze } from 'in-services/util/object';
import InputHeader from './InputHeader';

storiesOf('analyse/TraceConverter', module)
  .addDecorator(withKnobs)
  .add('Trace Converter', () => <TraceConverter />);

const TraceConverter = withState('inputValue', 'setInputValue', '')(function TraceConverterComponent({
  inputValue,
  setInputValue
}) {
  const jsonString = inputValue;
  let rootSpan;
  try {
    rootSpan = JSON.parse(jsonString);
    mapSpan(rootSpan);
    rootSpan = deepFreeze(rootSpan);
  } catch (e) {
    rootSpan = null;
  }

  return (
    <div>
      <InputHeader>
        <input
          style={{
            width: '100%',
            marginTop: 16,
            height: '50px'
          }}
          type="text"
          id={2}
          placeholder="paste JSON here"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </InputHeader>
      {rootSpan && <p>{JSON.stringify(rootSpan)}</p>}
    </div>
  );
});

const unnownServiceOrEndpoint = {
  id: 'unknown',
  label: 'Unknown',
  type: 'HTTP'
};

function mapSpan(span) {
  if (!span.children) {
    span.children = span.childSpans || [];
  }

  if (!span.label) {
    span.label = span.name;
  }

  if (!span.service) {
    span.service = {
      id: span.spanId,
      label: span.name,
      type: span.kind
    };
  }

  if (!span.endpoint) {
    span.endpoint = unnownServiceOrEndpoint;
  }

  delete span.stackTrace;
  delete span.childSpans;
  delete span.kind;
  delete span.name;
  delete span.spanId;
  delete span.data;
  delete span.traceId;
  delete span.totalErrorCount;

  for (let i = 0; i < span.children.length; i++) {
    mapSpan(span.children[i]);
  }
}
