/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { get } from 'lodash';

import { Card, Link, Stack, SvgIcon, Spacer } from '@instana/components';
import { create, just } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import ServiceComponent from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/ServiceComponent';
import { getCorrelatedWebsiteBeacons } from 'in-applications/analyze/components/TraceDetails/tabs/Summary/websiteCorrelation';
import LoadingCallDetails from 'in-applications/analyze/components/TraceDetails/components/CallDetails/LoadingCallDetails';
import IsSynthetic from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/IsSynthetic';
import Header from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/Header';
import getTraceActivityTreeNodeDetails from 'in-applications/subscriptions/getTraceActivityTreeNodeDetails';
import { hasOnlyExitSpan } from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { hasError, isLoading } from 'in-services/util/result';
import { latencyFixed } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { pendingResult } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip';
import { seconds } from 'in-services/time';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-applications/analyze/components/TraceDetails/components/CallDetails/CallDetails.mless';

const MAX_RETRIES = 1;
const RECENCY_WINDOW = seconds.toMillis(40);

export default function CallDetails(props) {
  const { rootCall, callId, traceId, correlationId, correlationType, startTime, duration, getColor, onClose } = props;
  const traceEndTime = startTime + duration;
  const callResult$ = useRetriableObservable({ traceId, callId, retries: MAX_RETRIES, traceEndTime });

  const callResult = useObservable(() => callResult$, [callResult$]) ?? (callResult$ ? pendingResult : null);

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

  let call;
  let cardContent;

  if (isLoading(callResult)) {
    cardContent = <LoadingCallDetails progress={callResult.progress} />;
  } else if (hasError(callResult)) {
    call = callResult;
    cardContent = <ErroneousResultPresenter errors={callResult.errors} isRetryError={isRetryError(callResult)} />;
  } else {
    call = callResult.data;
    const isBatched = call.batchSize > 1;
    const waitingTime = hasOnlyExitSpan(call)
      ? null
      : call.duration - (call.minSelfTime || call.selfTime || 0) - (call.networkTime || 0);
    const values = [
      {
        label: t('in-analyze:traceDetail.components.callDetails.started'),
        duration: call.start,
        formatter: formatDateTimeWithMilliSeconds
      },
      {
        label: isBatched
          ? t('in-analyze:traceDetail.components.callDetails.sumOfLatencies')
          : t('in-analyze:traceDetail.components.callDetails.latency'),
        duration: call.duration,
        showInfoIcon: isBatched,
        toolTipLabel: t('in-analyze:traceDetail.components.callDetails.latency')
      },
      {
        label: isBatched
          ? t('in-analyze:traceDetail.components.callDetails.elapsedTime')
          : t('in-analyze:traceDetail.components.callDetails.selfTime'),
        duration: call.minSelfTime || call.selfTime,
        totalDuration: call.duration,
        showDurationInpercent: !isBatched,
        showInfoIcon: isBatched
      },
      {
        label: t('in-analyze:traceDetail.components.callDetails.networkTime'),
        duration: call.networkTime,
        totalDuration: call.duration,
        showDurationInpercent: true
      },
      {
        label: t('in-analyze:traceDetail.components.callDetails.waitingTime'),
        duration: waitingTime,
        totalDuration: call.duration,
        showDurationInpercent: true
      }
    ];
    cardContent = (
      <>
        <DisplayTimeData values={values} batchCount={call.batchSize} />
        <Stack direction="vertical" gap="normal">
          <ServiceComponent call={call} websiteBeacon={websiteBeacon} mobileAppBeacon={mobileAppBeacon} />
          <IsSynthetic call={call} />
        </Stack>
      </>
    );
  }

  return (
    <aside className={locals.callDetails}>
      <Card
        title={<Header call={call} getColor={getColor} />}
        rightHeaderContent={<ActionButtons traceId={traceId} callId={callId} onClose={onClose} />}
      >
        {cardContent}
      </Card>
    </aside>
  );
}

function ActionButtons({ traceId, callId, onClose }) {
  const { trackDownloadCallDetailsClicked } = useApplicationTracker();
  const downloadUrl = `/api/application-monitoring/v2/analyze/traces/${encodeURIComponent(
    traceId
  )}/calls/${encodeURIComponent(callId)}/details?pretty`;

  const downloadLabel = t('in-analyze:traceDetail.components.callDetails.downloadRawSpanData');
  const closeLabel = t('in-analyze:traceDetails.callDetails.tooltipCloseCallDetails');
  const svgIconColor = themes.default.ids.color.option.neutral['500'];
  return (
    <>
      <Link
        href={downloadUrl}
        className={locals.downloadLink}
        target="_blank"
        onClick={() => trackDownloadCallDetailsClicked()}
      >
        <Tooltip content={downloadLabel}>
          <SvgIcon size="xs" aria-label={downloadLabel} type="lib_actions_download" color={svgIconColor} />
        </Tooltip>
      </Link>
      <Tooltip content={closeLabel}>
        <SvgIcon onClick={onClose} aria-label={closeLabel} type="lib_openclose_cancel" color={svgIconColor} />
      </Tooltip>
    </>
  );
}

function isRetryError(callResult) {
  return (
    callResult.errors?.length === 1 &&
    callResult.label === t('in-analyze:traceDetail.components.callDetails.labelError', 'Unexpected error')
  );
}

function useRetriableObservable({ traceId, callId, retries, traceEndTime }) {
  const [callResult$, setCallResult$] = useState(create);
  const [retry, setRetry] = useState(0);

  const id = traceId + callId;
  const lastIdRef = useRef(id);
  if (id !== lastIdRef.current) {
    lastIdRef.current = id;
    setCallResult$(create());
    setRetry(0);
  }

  const callResult = useObservable(getTraceActivityTreeNodeDetailsRetriable, [traceId, callId, retry]) ?? pendingResult;

  useEffect(() => {
    const callResultMissing = hasError(callResult) || (!isLoading(callResult) && !callResult.data);
    const retryDelay = traceEndTime + RECENCY_WINDOW - Date.now();
    const shouldRetry = callResultMissing && retryDelay > 0 && retry < retries;
    if (shouldRetry) {
      const timeoutId = setTimeout(() => setRetry(prev => prev + 1), retryDelay);
      return () => clearTimeout(timeoutId);
    }
    callResult$.emit(callResult);
  }, [retry, callResult$, callResult, retries, traceEndTime]);

  return callResult$;
}

function getTraceActivityTreeNodeDetailsRetriable([traceId, callId, retry]) {
  return retry <= MAX_RETRIES
    ? getTraceActivityTreeNodeDetails({
        traceId,
        nodeId: callId,
        // for retries, we have to modify the payload to bypass caching
        // backend ignores the "retry" field for this query
        retry
      })
    : just({
        label: t('in-analyze:traceDetail.components.callDetails.labelError', 'Unexpected error'),
        errors: [
          {
            message: t('in-analyze:traceDetail.components.callDetails.retryError', 'Call details could not be loaded.')
          }
        ]
      });
}

function DisplayTimeData({ values, batchCount }) {
  return (
    <Dl>
      {values.map(value => {
        const { label, duration, totalDuration, showDurationInpercent, showInfoIcon, toolTipLabel } = value;
        const formatter = value.formatter ?? latencyFixed.compact;
        const durationValue = duration == null ? valueMissingPlaceholder : `${formatter(duration)}`;
        const durationInPercent =
          totalDuration >= 1 && duration >= 1 && showDurationInpercent
            ? '(' + (((duration / totalDuration) * 100) | 0) + '%)'
            : null;
        return (
          <Di
            title={
              <div className={locals.iconContainer}>
                {label}
                <Spacer horizontal="xsmall" />

                {showInfoIcon && (
                  <Tooltip
                    content={t('in-analyze:traceDetail.components.callDetails.batchTooltip', {
                      batchCount: batchCount,
                      type: String(toolTipLabel ?? label).toLocaleLowerCase()
                    })}
                  >
                    <SvgIcon
                      type="lib_help_error_info_outline"
                      size="xxs"
                      color={themes.default.ids.color.option.neutral['700']}
                    />
                  </Tooltip>
                )}
              </div>
            }
            key={label}
          >
            {durationValue}
            {durationInPercent !== null ? ` ${durationInPercent}` : ''}
          </Di>
        );
      })}
    </Dl>
  );
}

function formatDateTimeWithMilliSeconds(time) {
  return formatDateTime(time) + '.' + new Date(time).getMilliseconds();
}
