import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { enrichWithJSONInput } from '../_helpers/json';
import Root from '../_helpers/Root';

storiesOf('newComponents/TraceConverter', module)
  .addDecorator(withKnobs)
  .add('Trace Converter', () => <TraceConverter />);

function TraceConverter() {
  const rootSpan = enrichWithJSONInput('', mapSpan);
  if (!rootSpan) {
    return null;
  }

  return (
    <Root>
      <p>{JSON.stringify(rootSpan)}</p>
    </Root>
  );
}

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
