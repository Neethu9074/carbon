import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { find } from 'in-services/arrayUtils';

export default function Details({ call }) {
  let entrySpan = find(call.spans, _span => _span.kind === 'ENTRY');
  let exitSpan = find(call.spans, _span => _span.kind === 'EXIT');

  return (
    <Fragment>
      {entrySpan && <h3>Entry</h3>}
      <SpanDetails span={entrySpan} />
      <br />
      {exitSpan && <h3>Exit</h3>}
      <SpanDetails span={exitSpan} />
    </Fragment>
  );
}

function SpanDetails({ span }) {
  if (!span) {
    return null;
  }
  return <SpanForgeDetails span={fromJS(convert(span))} />;
}
