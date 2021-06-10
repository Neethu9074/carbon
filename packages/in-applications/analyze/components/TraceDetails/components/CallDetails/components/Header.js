/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { LoadingSkeleton } from '@instana/components';
import { SvgIcon } from '@instana/components';

import { isUnknownTypeSpan } from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import ErrorIndicator from 'in-applications/analyze/components/TraceDetails/components/ErrorIndicator';
import { getColor as getColorForEndpointType } from 'in-applications/endpointTypes';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

import locals from './Header.mless';

export default function Header({ call }) {
  const endpoint = get(call, ['destination', 'endpoint']);

  const isLogSpan = get(call, ['spans', '0', 'name'], '').indexOf('log') === 0 && call.spans.length === 1;

  return (
    <Fragment>
      <div className={locals.title}>
        {call ? (
          <div className={locals.entityInformation}>
            <ErrorIndicator erroneous={call.errorCount} />
            <SvgIcon type="lib_application_call" />
            <span className={locals.callLabel}>{call.label || 'Undefined'}</span>
            {call.batchSize > 1 && (
              <Tooltip
                themeStyle="light"
                content={t(
                  'in-analyze:traceDetail.components.callDetails.thisCallIsBatchedAndRepresentsIndividualCalls',
                  { batchSize: call.batchSize }
                )}
              >
                <Pill className={locals.batchSizeIndicator} kind="lighter">
                  {call.batchSize}
                </Pill>
              </Tooltip>
            )}
            {!isUnknownTypeSpan(call) && endpoint && !isLogSpan && (
              <Pill kind="light" color={getColorForEndpointType(endpoint.type)}>
                {endpoint.type}
              </Pill>
            )}
          </div>
        ) : (
          <LoadingSkeleton className={locals.skeleton} />
        )}
      </div>
    </Fragment>
  );
}
