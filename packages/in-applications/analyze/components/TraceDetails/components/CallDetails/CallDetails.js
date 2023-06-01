/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef } from 'react';
import { get } from 'lodash';

import { Card, Stack, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';

import ServiceComponent from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/ServiceComponent';
import { getCorrelatedWebsiteBeacons } from 'in-applications/analyze/components/TraceDetails/tabs/Summary/websiteCorrelation';
import LoadingCallDetails from 'in-applications/analyze/components/TraceDetails/components/CallDetails/LoadingCallDetails';
import IsSynthetic from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/IsSynthetic';
import Header from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/Header';
import getTraceActivityTreeNodeDetails from 'in-applications/subscriptions/getTraceActivityTreeNodeDetails';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { pendingResult } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip';
import { minutes } from 'in-services/time';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './CallDetails.mless';

export default function CallDetails(props) {
  const { rootCall, callId, traceId, correlationId, correlationType, startTime, getColor, onClose } = props;
  const callResult =
    useObservable(() => {
      return getTraceActivityTreeNodeDetails({
        traceId: traceId,
        nodeId: callId
      });
    }, [traceId, callId]) ?? pendingResult;

  const websiteBeaconResult =
    useObservable(() => {
      if (rootCall && rootCall.id === callId) {
        return getCorrelatedWebsiteBeacons({
          traceId,
          correlationId: correlationType === 'web' ? correlationId : null,
          startTime
        });
      }
    }, [traceId, correlationType, correlationId, startTime, rootCall, callId]) ?? pendingResult;

  const mobileAppBeaconResult =
    useObservable(() => {
      if (rootCall && rootCall.id === callId) {
        return getMobileAppBeacons({
          tagFilters: [{ name: 'mobileBeacon.backend.traceId', stringValue: traceId, operator: 'EQUALS' }],
          timeConfig: {
            windowSize: minutes.toMillis(20),
            to: startTime + minutes.toMillis(10),
            focusedMoment: startTime + minutes.toMillis(10)
          },
          order: {
            by: 'mobileBeacon.timestamp', // Get the oldest beacon, which is most likely the one that triggered this trace. Please note that if a request
            // is served from a cache, the given beacon will be linked to the old trace (the one whose response was cached).
            direction: 'ASC'
          },
          pagination: {
            retrievalSize: 1
          }
        });
      }
    }, [traceId, minutes, startTime, rootCall, callId]) ?? pendingResult;

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
      <Card
        title={<Header call={call} getColor={getColor} />}
        rightHeaderContent={<ActionButtons call={call} onClose={onClose} />}
      >
        <Stack direction="vertical" gap="normal">
          <ServiceComponent call={call} websiteBeacon={websiteBeacon} mobileAppBeacon={mobileAppBeacon} />
          <IsSynthetic call={call} />
        </Stack>
      </Card>
    </aside>
  );
}

function ActionButtons({ call, onClose }) {
  const downloadLinkRef = useRef();

  useEffect(() => {
    let url = null;
    if (call) {
      const callBlob = new Blob([JSON.stringify(call, null, 2)], { type: 'application/json' });
      url = URL.createObjectURL(callBlob);
      downloadLinkRef.current.href = url;
    }
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [call]);

  const downloadLabel = t('in-analyze:traceDetail.components.callDetails.downloadRawSpanData');
  const closeLabel = t('in-analyze:traceDetails.callDetails.tooltipCloseCallDetails');
  const svgIconColor = theme.lib.colors.N500;
  return (
    <>
      <a ref={downloadLinkRef} className={locals.downloadLink} rel="noopener noreferrer" target="_blank">
        <Tooltip content={downloadLabel}>
          <SvgIcon size="xs" aria-label={downloadLabel} type="lib_actions_download" color={svgIconColor} />
        </Tooltip>
      </a>
      <Tooltip content={closeLabel}>
        <SvgIcon onClick={onClose} aria-label={closeLabel} type="lib_openclose_cancel" color={svgIconColor} />
      </Tooltip>
    </>
  );
}
