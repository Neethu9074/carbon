/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useMemo } from 'react';
import { get } from 'lodash';

import { Button, SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import {
  LARGE_TRACE_THRESHOLD,
  isLazyLoadedCallTreeSupported,
  shouldUseLazyLoadedCallTree
} from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import SplitScreenTraceDetailContent from 'in-applications/analyze/AnalyzeView2_0/components/SplitScreenTraceDetailContent';
import SplitScreenList from 'in-components/AnalyzeView/SplitScreenList/SplitScreenList';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import getTraceSummary from 'in-applications/subscriptions/getTraceSummary';
import { updateLocationToAnalyze } from 'in-applications/navigation/paths';
import tabs from 'in-applications/analyze/AnalyzeView2_0/components/tabs';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { traceIdFilterOverrideEnabled } from 'in-services/featureFlags';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { analyzeTagFilterExpression } from './analyzeTagFilter';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { analyzePath } from 'in-applications/navigation/paths';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { getColor } from 'in-applications/endpointTypes';
import { getChartGranularity } from 'in-stores/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';
import Pill from 'in-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './TraceDetailView.mless';

const maximumNumberOfCallsForLargeTraceConsideration = LARGE_TRACE_THRESHOLD;

export default function TraceDetailView(props) {
  const dataSource = props.dataSource;

  const {
    detailId: { callId, traceId, colorCode, logId },
    getHrefToDetailId,
    backendQueryModel
  } = props;
  const isFromSameTrace = analyzeTagFilterExpression(backendQueryModel, traceId);

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Applications',
          pageRootName: 'Analytics'
        }}
      />

      <Sticky
        header={
          <DashboardHeader
            {...props}
            title={t('in-applications:labelAnalytic')}
            icon={getIconByType(dataSource, 'application')}
            label={getLabelByType(dataSource)}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
            withBorderBottom
            showHistoricDataWarning={false}
          />
        }
      >
        <SplitScreenList
          {...props}
          ListItemContent={SplitScreenTraceDetailContent}
          getHrefToDetailId={getHrefToDetailId}
          subLabel={isFromSameTrace ? t('in-applications:analyze.filteredInThisTrace') : undefined}
        >
          <TabView
            key={traceId}
            props={props}
            HeaderComponent={Header}
            location={location}
            tabs={tabs}
            result$={getTraceSummary({ id: traceId })}
            withoutBreadcrumb
            withoutPadding
            withProps={({ result }) => {
              return {
                data: result.data,
                traceId,
                callId,
                logId,
                setCallId: id => props.setDetailId({ ...props.detailId, callId: id, logId: null }),
                setLogId: id => props.setDetailId({ ...props.detailId, callId: null, logId: id }),
                colorCodeType: colorCode ?? 'byEndpointType',
                setColorCodeMechanism: colorCode => props.setDetailId({ ...props.detailId, colorCode }),
                getColor: args => {
                  const getColorBy = colorCode === 'byServiceAndEndpoint' ? getColorByEndpoint : getColorByEndpointType;
                  return getColorBy({
                    ...args,
                    traceId
                  });
                }
              };
            }}
          />
        </SplitScreenList>
      </Sticky>
    </>
  );
}

function getColorByEndpoint({ service, endpoint, traceId }) {
  return getColorPool(traceId, theme.lib.colors.chart.strokeColors100).getColorHex(
    `${service && service.id}__${endpoint && endpoint.id}`
  );
}

function getColorByEndpointType({ endpoint }) {
  return getColor(endpoint ? endpoint.type : 'UNDEFINED');
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-applications:labelTrace')}
      icon="lib_application_trace"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
      renderTimeSelection={renderTimeSelection}
      hideUrlShortener
    />
  );
}

function applyTraceIdFilter(formModel, traceId) {
  const traceIdFilterExpression = [tagFilter('trace.id', EQUALS, traceId)];

  if (traceIdFilterOverrideEnabled) {
    return traceIdFilterExpression;
  }

  const shortTraceId = traceId.slice(-16);
  const hasTraceIdFilter = formModel.some(
    tagFilter =>
      tagFilter.name === 'trace.id' && tagFilter.operator === EQUALS && tagFilter.value?.endsWith(shortTraceId)
  );
  if (hasTraceIdFilter) {
    return formModel;
  }

  return joinExpressions({ expressions: [formModel, traceIdFilterExpression] });
}

function renderButtonLine(props) {
  return <TraceDetailViewButtonLine {...props} />;
}

function TraceDetailViewButtonLine({ traceId, result, formModel, facets }) {
  const timeConfig = useTimeConfig();
  const { location, createHref } = useNavigation();

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
      formModel: applyTraceIdFilter(formModel, traceIdInUrl),
      facets: traceIdFilterOverrideEnabled ? null : facets,
      timeConfig: adjustedTimeConfig,
      hiddenCalls: { includeInternal: true, includeSynthetic: true },
      resetUndefinedParams: false
    });
    return location;
  }, [adjustedTimeConfig, facets, formModel, location, traceIdInUrl]);

  if (!role.canViewLogs || !role.canViewTraceDetails) {
    return null;
  }

  const traceDownloadUrl = isLazyLoadedCallTreeSupported(result?.data)
    ? `/api/application-monitoring/v2/analyze/traces/${encodeURIComponent(
        traceIdInUrl
      )}?pretty&retrievalSize=200&offset=0&ingestionTime=${Date.now()}`
    : `/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceIdInUrl)}?pretty`;

  return (
    <>
      <Button icon="lib_actions_download" kind="secondary" target="_blank" href={traceDownloadUrl}>
        {t('in-applications:linkDownload')}
      </Button>
      <Button
        icon="lib_analyze"
        kind="secondary"
        href={createHref({ ...locationAnalyzeCallsOfThisTrace, pathname: analyzePath })}
        onClick={() => {
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
        }}
      >
        {t('in-applications:analyze.analyzeCallsOfThisTrace')}
      </Button>
    </>
  );
}

function renderContext({ getHrefToUngroupedView, tracker }) {
  return (
    <Link
      className={locals.analyticsLink}
      href={getHrefToUngroupedView()}
      onClick={() => tracker.traceViewNavigateBackToUa()}
    >
      {t('in-applications:labelAnalytic')}
    </Link>
  );
}

function renderMetaInformation({ traceId, result }) {
  const displayedTraceId = result?.data?.id ?? traceId;
  const lazyLoadedCallTree = shouldUseLazyLoadedCallTree(result?.data);

  return (
    <div>
      <span className={locals.traceIdLabel}>Trace ID: </span>
      <code className={locals.traceId}>{displayedTraceId}</code>
      {result.data && !result.data.id && (
        <Tooltip content={t('in-applications:analyze.traceIdTooltip')}>
          <SvgIcon className={locals.icon} type="lib_help_error_info_outline" size="xs" />
        </Tooltip>
      )}
      {lazyLoadedCallTree && (
        <Tooltip
          content={t('in-applications:traceDetail.tabs.summary.timeLineViewNotAvailable', {
            maximumNumberOfCallsForLargeTraceConsideration: maximumNumberOfCallsForLargeTraceConsideration
          })}
        >
          <Pill className={locals.label}>{t('in-applications:traceDetail.tabs.summary.largeTrace')}</Pill>
        </Tooltip>
      )}
      {lazyLoadedCallTree && (
        <Pill kind="primary" className={locals.betaPill}>
          {t('in-applications:traceDetail.beta')}
        </Pill>
      )}
    </div>
  );
}

function renderTimeSelection({ getHrefToUngroupedView, tracker }) {
  return (
    <Link href={getHrefToUngroupedView()} onClick={() => tracker.traceViewClosedTracker()}>
      <Tooltip content={t('in-applications:analyze.closeTraceDetail')}>
        <SvgIcon
          className={locals.closeIcon}
          aria-label={t('in-applications:analyze.closeTraceDetail')}
          type="lib_openclose_cancel"
        />
      </Tooltip>
    </Link>
  );
}
