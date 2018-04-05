import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { find } from 'in-services/arrayUtils';

import locals from './Details.mless';

export default function Details({ call }) {
  let entrySpan = find(call.spans, _span => _span.kind === 'ENTRY');
  let exitSpan = find(call.spans, _span => _span.kind === 'EXIT');

  entrySpan = entrySpan && entrySpan.data && Object.keys(entrySpan.data).length > 0 ? entrySpan : null;
  exitSpan = exitSpan && exitSpan.data && Object.keys(exitSpan.data).length > 0 ? exitSpan : null;

  return (
    <Fragment>
      {entrySpan && <h3>From</h3>}
      {entrySpan && <SpanDetails span={entrySpan} />}
      {exitSpan && <h3>To</h3>}
      {exitSpan && <SpanDetails span={exitSpan} />}
    </Fragment>
  );
}

function SpanDetails({ span }) {
  return (
    <div className={locals.forgeDetailsWrapper}>
      <SpanForgeDetails span={fromJS(convert(span))} />
    </div>
  );
}
