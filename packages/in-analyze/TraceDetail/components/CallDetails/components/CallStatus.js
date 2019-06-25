import { get } from 'lodash';
import React from 'react';

import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';
import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';

import locals from './CallStatus.mless';

export default function CallStatus({ call }) {
  if (call.errorCount < 1) {
    return null;
  }

  const span = call.spans[0];
  const statusCode = get(span, ['data', 'http', 'status']);
  if (!statusCode) {
    return null;
  }

  return (
    <Group title="Error">
      <div className={locals.callStatus}>
        <ErrorIndicator erroneous={call.errorCount} />
        <div className={locals.callStatusInformation}>Status {statusCode}</div>
      </div>
    </Group>
  );
}
