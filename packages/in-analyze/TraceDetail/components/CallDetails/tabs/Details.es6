import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

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
  const type = Object.keys(span)[0];
  if (!type) {
    return null;
  }

  const fakedSpan = {
    name: type,
    data: {}
  };
  fakedSpan.data[type] = span[type];

  return <SpanForgeDetails span={fromJS(fakedSpan)} />;
}
