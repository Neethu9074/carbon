import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { find } from 'in-services/arrayUtils';

import locals from './Details.mless';

export default function Details({ call }) {
  return (
    <Fragment>
      <SpanDetails call={call} kind="ENTRY" />
      <SpanDetails call={call} kind="EXIT" />
    </Fragment>
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
