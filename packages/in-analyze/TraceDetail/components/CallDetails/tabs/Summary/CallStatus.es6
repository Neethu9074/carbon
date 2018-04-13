import { get } from 'lodash';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './CallStatus.mless';

export default function CallStatus({ call }) {
  if (call.errorCount < 1) {
    return null;
  }

  return (
    <div className={locals.callStatus}>
      <Status call={call} />
      <ErrorIndicator errorCount={call.errorCount} />
    </div>
  );
}

function Status({ call }) {
  const span = call.spans[0];
  const statusCode = get(span, ['data', 'http', 'status']);

  if (!statusCode) {
    return null;
  }

  return (
    <div className={locals.callStatusInformation}>
      <SvgIcon className={locals.infoIcon} type="info" width={14} height={14} color="#47626A" />
      Status {statusCode}
    </div>
  );
}

function ErrorIndicator({ errorCount }) {
  if (errorCount < 1) {
    return null;
  }

  return (
    <div className={locals.errorIndicator}>
      <div className={locals.errorIconWrapper}>!</div>
      <span>{`${errorCount} Error${errorCount > 1 ? 's' : ''}`}</span>
    </div>
  );
}
