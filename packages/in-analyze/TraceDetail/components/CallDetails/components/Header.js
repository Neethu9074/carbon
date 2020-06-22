import React, { Fragment } from 'react';
import { get } from 'lodash';

import { getColor as getColorForEndpointType } from 'in-applications/endpointTypes';
import { isUnknownTypeSpan } from 'in-analyze/TraceDetail/shared/CallHelper';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { error } from 'in-new-components/Message/types';
import Message from 'in-new-components/Message';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';

import locals from './Header.mless';

export default function Header({ call }) {
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
      </div>
      {call && call.errorCount > 0 && <Message className={locals.message} small type={error} title="Erroneous Call" />}
    </Fragment>
  );
}
