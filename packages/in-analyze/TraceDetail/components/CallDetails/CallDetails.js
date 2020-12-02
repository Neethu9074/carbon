import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import ServiceComponent from 'in-analyze/TraceDetail/components/CallDetails/components/ServiceComponent';
import { getCorrelatedWebsiteBeacons } from 'in-analyze/TraceDetail/tabs/Summary/websiteCorrelation';
import LoadingCallDetails from 'in-analyze/TraceDetail/components/CallDetails/LoadingCallDetails';
import IsSynthetic from 'in-analyze/TraceDetail/components/CallDetails/components/IsSynthetic';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Header from 'in-analyze/TraceDetail/components/CallDetails/components/Header';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { pendingResult } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { minutes } from 'in-services/time';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import locals from './CallDetails.mless';

const traceIdCorrelationType = 'traceId';

export default compose(
  connectTo(({ rootCall, callId, traceId, startTime }) => {
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

    const correlationInformation$ = callResult$
      .map(result => extractCorrelationInformation(traceId, result))
      .filter(Boolean);

    return {
      callResult: callResult$,
      websiteBeaconResult: correlationInformation$
        .filter(({ correlationType }) => correlationType === traceIdCorrelationType || correlationType === 'web')
        .flatMap(({ correlationId }) =>
          getCorrelatedWebsiteBeacons({
            traceId,
            correlationId,
            startTime
          })
        ),
      mobileAppBeaconResult: correlationInformation$
        .filter(({ correlationType }) => correlationType === traceIdCorrelationType || correlationType === 'mobile')
        .flatMap(({ correlationId }) =>
          getMobileAppBeacons({
            tagFilters: [{ name: 'mobileBeacon.backend.traceId', stringValue: correlationId, operator: 'EQUALS' }],
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
        )
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
      </Card>
      <IsSynthetic call={call} />
    </aside>
  );
}

function extractCorrelationInformation(traceId, result) {
  if (!result.data) {
    return null;
  }

  for (const span of result.data.spans) {
    const correlationId = span?.data?.correlationId;
    const correlationType = span?.data?.correlationType;

    if (correlationId && correlationType) {
      return {
        correlationId,
        correlationType
      };
    }
  }

  return {
    correlationId: traceId,
    correlationType: traceIdCorrelationType
  };
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
