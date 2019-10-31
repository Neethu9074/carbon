import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import ServiceComponent from 'in-analyze/TraceDetail/components/CallDetails/components/ServiceComponent';
import LoadingCallDetails from 'in-analyze/TraceDetail/components/CallDetails/LoadingCallDetails';
import IsSynthetic from 'in-analyze/TraceDetail/components/CallDetails/components/IsSynthetic';
import Seperator from 'in-analyze/TraceDetail/components/CallDetails/components/Seperator';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Header from 'in-analyze/TraceDetail/components/CallDetails/components/Header';
import getWebsiteBeacons from 'in-websites/subscriptions/getWebsiteBeacons';
import { pendingResult } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import locals from './CallDetails.mless';

export default compose(
  connectTo(props => ({
    callResult: getTraceActivityTreeNodeDetails({
      traceId: props.traceId,
      nodeId: props.callId
    }).startWith(pendingResult)
  })),
  connectTo(({ traceId, startTime }) => {
    return {
      beaconResult: getWebsiteBeacons({
        tagFilters: [{ name: 'beacon.backend.traceId', stringValue: traceId, operator: 'EQUALS' }],
        timeConfig: {
          windowSize: 1000 * 60 * 60,
          to: startTime + 1000 * 60 * 30,
          focusedMoment: startTime + 1000 * 60 * 30
        },
        order: {
          by: 'beacon.timestamp',
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
  const { callResult, getColor, onClose, beaconResult } = props;

  const beacon = beaconResult.data && beaconResult.data.items.length > 0 ? beaconResult.data.items[0].beacon : null;
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
      <Header call={call} getColor={getColor} onClose={onClose} />
      <Seperator />
      <ServiceComponent call={call} beacon={beacon} />
      <IsSynthetic call={call} />
    </aside>
  );
}
