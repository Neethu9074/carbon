import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import convert from 'in-analyze/TraceDetail/components/CallDetails/fakedSpanConverter';
import SpanForgeDetails from 'in-components/SpanForgeDetails/SpanForgeDetails';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { isInstanaEngineer } from 'in-stores/user';

export default function SpanDetails({ call, span }) {
  return (
    <Fragment>
      {isInstanaEngineer && (
        <Dl>
          <Di title="Span Type">{span.name}</Di>
        </Dl>
      )}
      <SpanForgeDetails key={call.id} span={fromJS(convert(span))} />
    </Fragment>
  );
}
