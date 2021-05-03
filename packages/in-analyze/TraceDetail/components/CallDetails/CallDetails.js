/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Card } from '@instana/components';

import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import ServiceComponent from 'in-analyze/TraceDetail/components/CallDetails/components/ServiceComponent';
import { getCorrelatedWebsiteBeacons } from 'in-analyze/TraceDetail/tabs/Summary/websiteCorrelation';
import LoadingCallDetails from 'in-analyze/TraceDetail/components/CallDetails/LoadingCallDetails';
import IsSynthetic from 'in-analyze/TraceDetail/components/CallDetails/components/IsSynthetic';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Header from 'in-analyze/TraceDetail/components/CallDetails/components/Header';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { pendingResult } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip';
import { minutes } from 'in-services/time';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './CallDetails.mless';

export default compose(
  connectTo(({ rootCall, callId, traceId, correlationId, correlationType, startTime }) => {
    const callResult$ = getTraceActivityTreeNodeDetails({
      traceId: traceId,
      nodeId: callId
    }).startWith(pendingResult);

    if (!rootCall || (rootCall.id !== callId && callId !== 'ROOT')) {
      // No need to attempt to load mobile app / website correlation data for non root calls.
      return {
        callResult: callResult$
      };
    }

    return {
      callResult: callResult$,
      websiteBeaconResult: getCorrelatedWebsiteBeacons({
        traceId,
        correlationId: correlationType === 'web' ? correlationId : null,
        startTime
      }),
      mobileAppBeaconResult: getMobileAppBeacons({
        tagFilters: [{ name: 'mobileBeacon.backend.traceId', stringValue: traceId, operator: 'EQUALS' }],
        timeConfig: {
          windowSize: minutes.toMillis(20),
          to: startTime + minutes.toMillis(10),
          focusedMoment: startTime + minutes.toMillis(10)
        },
        order: {
          by: 'mobileBeacon.timestamp',
          direction: 'DESC'
        },
        pagination: {
          retrievalSize: 1
        }
      })
    };
  })
)(CallDetails);

function CallDetails(props) {
  const { callResult, getColor, onClose, websiteBeaconResult, mobileAppBeaconResult } = props;

  const websiteBeacon = get(websiteBeaconResult, ['data', 'items', 0, 'beacon'], null);
  const mobileAppBeacon = get(mobileAppBeaconResult, ['data', 'items', 0, 'beacon'], null);
  const isLoading = get(callResult, ['progress', 'loading']);

  if (isLoading) {
    return (
      <div className={locals.callDetails}>
        <LoadingCallDetails onClose={onClose} progress={callResult.progress} />
      </div>
    );
  }

  const hasErrors = get(callResult, ['errors', 'length'], 0) > 0;
  if (hasErrors) {
    return (
      <div className={locals.callDetails}>
        <ErroneousResultPresenter errors={callResult.errors} />
      </div>
    );
  }

  const call = callResult.data;

  return (
    <aside className={locals.callDetails}>
      <Card title={<Header call={call} getColor={getColor} />} header={<CloseButton onClick={onClose} />}>
        <ServiceComponent call={call} websiteBeacon={websiteBeacon} mobileAppBeacon={mobileAppBeacon} />
        <IsSynthetic call={call} />
      </Card>
    </aside>
  );
}

function CloseButton({ onClick }) {
  const closeLabel = t('in-analyze:traceDetails.callDetails.tooltipCloseCallDetails');
  return (
    <Tooltip content={closeLabel}>
      <SvgIcon onClick={onClick} aria-label={closeLabel} type="lib_openclose_cancel" />
    </Tooltip>
  );
}
