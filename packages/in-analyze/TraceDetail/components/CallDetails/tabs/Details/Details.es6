import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import EntryOrExitWrapper from 'in-analyze/TraceDetail/components/CallDetails/components/EntryOrExitWrapper';
import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { find } from 'in-services/arrayUtils';

import locals from './Details.mless';

export default function Details({ call }) {
  return (
    <Fragment>
      <SpanDetails call={call} />
      <SpanDetails call={call} isEntry />
    </Fragment>
  );
}

function SpanDetails({ call, isEntry }) {
  const kind = isEntry ? 'ENTRY' : 'EXIT';
  let span = find(call.spans, _span => _span.kind === kind);
  span = span && span.data && Object.keys(span.data).length > 0 ? span : null;

  if (!span) {
    return null;
  }

  return (
    <EntryOrExitWrapper isEntry={isEntry}>
      <div className={locals.forgeDetailsWrapper}>
        <SpanForgeDetails span={fromJS(convert(span))} />
      </div>
    </EntryOrExitWrapper>
  );
}
