import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { isInstanaEngineer } from 'in-stores/user';

import locals from './SpanDetails.mless';

export default function SpanDetails({ call, span }) {
  return (
    <Fragment>
      {isInstanaEngineer && (
        <div className={locals.spanType}>
          <div className={locals.title}>Span Type</div>
          <div className={locals.text}>{span.name}</div>
        </div>
      )}
      <SpanForgeDetails key={call.id} span={fromJS(convert(span))} />
    </Fragment>
  );
}
