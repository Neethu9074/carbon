import { get } from 'lodash';
import React from 'react';

import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';
import SvgIcon from 'in-components/SvgIcon';

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
    <Group title="Errors">
      <div className={locals.callStatus}>
        <ErrorIndicator errorCount={call.errorCount} />
        <Status statusCode={statusCode} />
      </div>
    </Group>
  );
}

function ErrorIndicator({ errorCount }) {
  return (
    <div className={locals.errorIndicator}>
      <div className={locals.errorIconWrapper}>!</div>
      <span>{`${errorCount} Error${errorCount > 1 ? 's' : ''}`}</span>
    </div>
  );
}

function Status({ statusCode }) {
  return (
    <div className={locals.callStatusInformation}>
      <SvgIcon className={locals.infoIcon} type="info" width={14} height={14} color="#47626A" />
      Status {statusCode}
    </div>
  );
}
