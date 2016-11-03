import React from 'react';

import {emptyMap} from 'in-services/fixedImmutables';
import Code from 'in-sdk/components/traceDetails/Code';

export default function GenericSpanDetailView({span}) {
  const data = span.getIn(['data'], emptyMap);
  return (
    <Code code={JSON.stringify(data.toJS(), 0, 2)}
          type='json'/>
  );
}
