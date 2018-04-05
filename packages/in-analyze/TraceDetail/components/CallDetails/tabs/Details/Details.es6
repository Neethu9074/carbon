import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { find } from 'in-services/arrayUtils';

import locals from './Details.mless';

export default function Details({ call }) {
  let entrySpan = find(call.spans, _span => _span.kind === 'ENTRY');
  let exitSpan = find(call.spans, _span => _span.kind === 'EXIT');

  return (
    <Fragment>
      {entrySpan && <h3>From</h3>}
      <SpanDetails span={entrySpan} />
      <br />
      {exitSpan && <h3>To</h3>}
      <SpanDetails span={exitSpan} />
    </Fragment>
  );
}

function SpanDetails({ span }) {
  if (!span) {
    return null;
  }
  return (
    <div className={locals.forgeDetailsWrapper}>
      <SpanForgeDetails span={fromJS(convert(span))} />
    </div>
  );
}
