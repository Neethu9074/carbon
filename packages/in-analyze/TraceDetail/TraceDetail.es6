import React from 'react';

import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { traceDetail } from 'in-analyze/navigation/paths';

export default function TraceDetail({ location }) {
  const props = {
    traceId: getMatrixParameter(location, traceDetail, traceIdMatrixParameter)
  };
  return <div>Hello from Trace Detail for trace id {props.traceId}!</div>;
}
