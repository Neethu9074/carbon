import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';

export default function Details({ call }) {
  return (
    <Fragment>
      {call.data.ENTRY && <h3>Entry</h3>}
      <SpanDetails span={call.data.ENTRY} />
      <br />
      {call.data.EXIT && <h3>Exit</h3>}
      <SpanDetails span={call.data.EXIT} />
    </Fragment>
  );
}

function SpanDetails({ span }) {
  if (!span) {
    return null;
  }
  return <SpanForgeDetails span={fromJS(convert(span))} />;
}
