import { fromJS } from 'immutable';
import React from 'react';

import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { find } from 'in-services/arrayUtils';

import locals from './Details.mless';

export default function Details({ call }) {
  return (
    <Group title="Details">
      <SpanDetails call={call} kind="ENTRY" />
      <SpanDetails call={call} kind="EXIT" />
    </Group>
  );
}

function SpanDetails({ call, kind }) {
  let span = find(call.spans, _span => _span.kind === kind);
  span = span && span.data && Object.keys(span.data).length > 0 ? span : null;

  if (!span) {
    return null;
  }

  return (
    <div className={locals.forgeDetailsWrapper}>
      <SpanForgeDetails span={fromJS(convert(span))} />
    </div>
  );
}
