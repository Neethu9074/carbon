/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo, useRef } from 'react';

import { CarbonMenuItem, Button, CarbonMenuButton } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error needs ts migration
import { updateLocationToAnalyze } from 'in-applications/navigation/paths';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { isTroubleshootingModeEnabled$ } from 'in-applications/isTroubleshootingModeEnabled';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { isLazyLoadedCallTreeSupported } from '../../traceSummary';
import DropdownButton from 'in-components/Button/DropdownButton';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { getChartGranularity } from 'in-stores/metric/metric';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import { analyzePath } from 'in-websites/navigation/paths';
import { compositeRef } from 'in-services/util/react';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Result, TraceSummary } from 'in-types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/TraceDetailView.mless';

interface TraceDetailViewButtonLineProps {
  traceId: string;
  result: Result<TraceSummary>;
}

export function TraceDetailViewButtonLine({ traceId, result }: TraceDetailViewButtonLineProps) {
  const timeConfig = useTimeConfig();
  const { location, createHref } = useNavigation();
  const { trackAnalyzeCallsOfTraceClicked, trackDownloadTraceClicked } = useApplicationTracker();
  const ref: React.MutableRefObject<HTMLButtonElement | HTMLAnchorElement | undefined> = useRef();

  const isInternalVisible = useObservable(isInternalVisible$, []);
  const isTroubleshootingModeEnabled = useObservable(isTroubleshootingModeEnabled$, []);

  const traceIdInUrl = result?.data?.id ?? traceId;

  let adjustedTimeConfig = timeConfig;
  if (result?.data) {
    // adjust the selected time range to cover the whole trace
    adjustedTimeConfig = getAdjustedTimeConfigToIncludeTimestamp(
      timeConfig,
      result.data.startTime,
      getChartGranularity
    );
    adjustedTimeConfig = getAdjustedTimeConfigToIncludeTimestamp(
      timeConfig,
      result.data.startTime + result.data.duration,
      getChartGranularity
    );
  }

  const locationAnalyzeCallsOfThisTrace = useMemo(() => {
    updateLocationToAnalyze(location, {
      dataSource: 'calls',
      formModel: applyTraceIdFilter(traceIdInUrl),
      facets: null,
      timeConfig: adjustedTimeConfig,
      hiddenCalls: { includeInternal: true, includeSynthetic: true },
      resetUndefinedParams: false
    });
    return location;
  }, [adjustedTimeConfig, location, traceIdInUrl]);

  if (!role?.canViewLogs || !role?.canViewTraceDetails) {
    return null;
  }

  function handleOnClickAnalyzeCall() {
    if (adjustedTimeConfig !== timeConfig) {
      addMessage(
        {
          type: 'info',
          timeout: 5000,
          content: t('in-applications:traceDetail.tabs.summary.adjustedTimeConfigForTrace')
        },
        'adjustedTimeConfig'
      );
    }
    trackAnalyzeCallsOfTraceClicked();
  }

  const traceDownloadUrl = isLazyLoadedCallTreeSupported(result?.data)
    ? `/api/application-monitoring/v2/analyze/traces/${encodeURIComponent(
        traceIdInUrl
      )}?pretty&retrievalSize=200&offset=0&ingestionTime=${Date.now()}`
    : `/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceIdInUrl)}?pretty`;

  const rawTraceDownloadUrl =
    `/api/application-monitoring/analyze/traces/` +
    encodeURIComponent(traceIdInUrl) +
    `/raw?retrievalSize=100&offset=0&ingestionTime=${Date.now()}`;

  // TODO: type correctly
  // TODO: extrace to own component?
  const DownloadTraceOptions = ({ close }: any) => {
    if (carbonButtonEnabled) {
      return (
        <>
          <CarbonMenuItem
            label={t('in-applications:linkDownloadCalls')}
            onClick={() => {
              trackDownloadTraceClicked({ rawTrace: false });
              window.open(traceDownloadUrl, '_blank');
            }}
          />
          <CarbonMenuItem
            onClick={() => {
              trackDownloadTraceClicked({ rawTrace: true });
              window.open(rawTraceDownloadUrl, '_blank');
            }}
            label={t('in-applications:linkDownloadRawTrace')}
          />
        </>
      );
    }
    return (
      <div className={locals.downloadDropdown}>
        <Button
          kind="secondary"
          noAutoMargin
          className={locals.downloadOption}
          onClick={() => {
            trackDownloadTraceClicked({ rawTrace: false });
            close();
            window.open(traceDownloadUrl, '_blank');
          }}
        >
          {t('in-applications:linkDownloadCalls')}
        </Button>
        <Button
          kind="secondary"
          noAutoMargin
          className={locals.downloadOption}
          onClick={() => {
            trackDownloadTraceClicked({ rawTrace: true });
            close();
            window.open(rawTraceDownloadUrl, '_blank');
          }}
        >
          {t('in-applications:linkDownloadRawTrace')}
        </Button>
      </div>
    );
  };

  return (
    <>
      {isTroubleshootingModeEnabled || isInternalVisible ? (
        carbonButtonEnabled ? (
          <CarbonMenuButton size="sm" kind="primary" label={t('in-applications:linkDownload')} menuAlignment="bottom">
            <DownloadTraceOptions />
          </CarbonMenuButton>
        ) : (
          <Overlay withoutWrapper content={DownloadTraceOptions} align="bottomMiddle">
            {({ toggle, refSetter }) => (
              <DropdownButton
                kind="secondary"
                icon="lib_actions_download"
                onClick={toggle}
                refSetter={compositeRef<HTMLElement>(refSetter, ref)}
              >
                {t('in-applications:linkDownload')}
              </DropdownButton>
            )}
          </Overlay>
        )
      ) : (
        <Button
          icon="lib_actions_download"
          kind="secondary"
          target="_blank"
          href={traceDownloadUrl}
          size={carbonButtonEnabled ? 'compact' : 'normal'}
          onClick={() => trackDownloadTraceClicked({ rawTrace: false })}
        >
          {t('in-applications:linkDownload')}
        </Button>
      )}
      <Button
        icon="lib_analyze"
        kind="secondary"
        href={createHref({ ...locationAnalyzeCallsOfThisTrace, pathname: analyzePath })}
        onClick={handleOnClickAnalyzeCall}
        size={carbonButtonEnabled ? 'compact' : 'normal'}
        className={carbonButtonEnabled ? locals.carbonAnalyzeButton : undefined}
      >
        {t('in-applications:analyze.analyzeCallsOfThisTrace')}
      </Button>
    </>
  );
}

function applyTraceIdFilter(traceId: string) {
  const traceIdFilterExpression = [tagFilter('trace.id', EQUALS, traceId)];
  return traceIdFilterExpression;
}
