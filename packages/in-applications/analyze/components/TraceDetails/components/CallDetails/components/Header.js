/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { LoadingSkeleton } from '@instana/components';
import { SvgIcon, Pill } from '@instana/components';

import { isUnknownTypeSpan } from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import ErrorIndicator from 'in-applications/analyze/components/TraceDetails/components/ErrorIndicator';
import { getColor as getColorForEndpointType } from 'in-applications/endpointTypes';
import { hasError, isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Header.mless';

export default function Header({ call }) {
  if (!call || isLoading(call)) {
    return <LoadingSkeleton className={locals.loadingSkeleton} />;
  }

  if (hasError(call)) {
    return (
      <div className={locals.title}>
        <ErrorIndicator erroneous={call.errorCount || call.errors?.length > 0} />
        <span className={locals.callLabel}>
          {call.label || t('in-analyze:traceDetail.components.callDetails.labelError')}
        </span>
      </div>
    );
  }

  const endpoint = get(call, ['destination', 'endpoint']);
  const isLogSpan = get(call, ['spans', '0', 'name'], '').indexOf('log') === 0 && call?.spans?.length === 1;

  return (
    <div className={locals.title}>
      <div className={locals.entityInformation}>
        <ErrorIndicator erroneous={call.errorCount} />
        <SvgIcon type="lib_application_call" />
        <span className={locals.callLabel}>{call.label || 'Undefined'}</span>
        {call.batchSize > 1 && (
          <Tooltip
            themeStyle="light"
            content={t('in-analyze:traceDetail.components.callDetails.thisCallIsBatchedAndRepresentsIndividualCalls', {
              batchSize: call.batchSize
            })}
          >
            <Pill className={locals.batchSizeIndicator} kind="lighter">
              {call.batchSize}
            </Pill>
          </Tooltip>
        )}
        {!isUnknownTypeSpan(call) && endpoint && !isLogSpan && (
          <Pill kind="light" className={locals.pillWidth} color={getColorForEndpointType(endpoint.type)}>
            {endpoint.type}
          </Pill>
        )}
      </div>
    </div>
  );
}
