import React, { Fragment } from 'react';
import { get } from 'lodash';

import ErroneousCallIndicator from 'in-analyze/TraceDetail/components/CallDetails/components/ErroneousCallIndicator';
import { getColor as getColorForEndpointType } from 'in-applications/endpointTypes';
import { isUnknownTypeSpan } from 'in-analyze/TraceDetail/shared/CallHelper';
import Skeleton from 'in-new-components/Loading/Skeleton';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';

import locals from './Header.mless';

export default function Header({ call, onClose }) {
  const endpoint = get(call, ['destination', 'endpoint']);

  const isLogSpan = get(call, ['spans', '0', 'name'], '').indexOf('log') === 0 && call.spans.length === 1;

  return (
    <Fragment>
      <div className={locals.title}>
        {call ? (
          <div className={locals.entityInformation}>
            <SvgIcon type="lib_application_call" />
            <span className={locals.callLabel}>{call.label || 'Undefined'}</span>
            {!isUnknownTypeSpan(call) &&
              endpoint &&
              !isLogSpan && (
                <Pill kind="light" color={getColorForEndpointType(endpoint.type)}>
                  {endpoint.type}
                </Pill>
              )}
          </div>
        ) : (
          <Skeleton className={locals.skeleton} />
        )}
        <CloseButton onClick={onClose} />
      </div>
      {call && call.errorCount > 0 && <ErroneousCallIndicator />}
    </Fragment>
  );
}

function CloseButton({ onClick }) {
  return (
    <Tooltip content="Close call details">
      <SvgIcon
        className={locals.closeIcon}
        onClick={onClick}
        aria-label="Close call details"
        type="lib_openclose_cancel"
      />
    </Tooltip>
  );
}
