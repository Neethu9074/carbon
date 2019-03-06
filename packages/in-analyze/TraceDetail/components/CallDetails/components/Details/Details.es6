import { fromJS } from 'immutable';
import React, { Fragment } from 'react';

import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { isInstanaEngineer } from 'in-stores/user';
import { find } from 'in-services/arrayUtils';

import locals from './Details.mless';

export default function Details({ call }) {
  return (
    <Fragment>
      <SpanDetails title="Caller Details" call={call} kind="EXIT" />
      <SpanDetails title="Details" call={call} kind="INTERMEDIATE" />
      {/* Show data for spans which do not have a kind (or an invalid one) */}
      <SpanDetails title="Details" call={call} kind={null} />
      <SpanDetails title="Details" call={call} kind={undefined} />
      <SpanDetails title="Callee Details" call={call} kind="ENTRY" />
    </Fragment>
  );
}

function SpanDetails({ title, call, kind }) {
  let span = find(call.spans, _span => _span.kind === kind);
  span = span && span.data && Object.keys(span.data).length > 0 ? span : null;

  if (!span) {
    return null;
  }

  return (
    <Group title={title}>
      <div className={locals.forgeDetailsWrapper}>
        {isInstanaEngineer && (
          <span>
            <b>Span Type</b> {span.name}
          </span>
        )}
        <SpanForgeDetails key={call.id} span={fromJS(convert(span))} />
      </div>
    </Group>
  );
}
