/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { get } from 'lodash';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import SplitScreenTraceDetailContent from 'in-applications/analyze/AnalyzeView2_0/components/SplitScreenTraceDetailContent';
import SplitScreenList from 'in-components/AnalyzeView/SplitScreenList/SplitScreenList';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import tabs from 'in-applications/analyze/AnalyzeView2_0/components_alt/tabs';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getColorPool } from 'in-services/util/ColorGenerator';
import DashboardHeader from 'in-components/DashboardHeader';
import { getColor } from 'in-applications/endpointTypes';
import Tooltip from 'in-components/Tooltip';
import { connection } from 'in-connection';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './TraceDetailView.mless';

export default function TraceDetailView(props) {
  const {
    dataSource,
    getHrefToDetailId,
    detailId: { callId, traceId, colorCode, logId }
  } = props;

  const location = useLocation();
  useTraceMarker(traceId);

  const [activeView, setActiveView] = useState('tree');
  const [showServiceInformation, setShowServiceInformation] = useState(true);
  const [showSubCallBars, setShowSubCallBars] = useState(false);

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
          />
        }
      >
        <SplitScreenList
          {...props}
          ListItemContent={SplitScreenTraceDetailContent}
          getHrefToDetailId={getHrefToDetailId}
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
                  return getColorByFunction(colorCode)({
                    ...args,
                    traceId
                  });
                },
                activeView,
                setActiveView,
                showServiceInformation,
                setShowServiceInformation,
                showSubCallBars,
                setShowSubCallBars
              };
            }}
          />
        </SplitScreenList>
      </Sticky>
    </>
  );
}

function getColorByFunction(colorCode) {
  if (colorCode === 'byService') {
    return getColorByService;
  }
  if (colorCode === 'byEndpoint') {
    return getColorByEndpoint;
  }
  return getColorByEndpointType;
}

function getColorByService({ service, traceId }) {
  return getColorPool(traceId, theme.lib.colors.chart.strokeColors100).getColorHex(`${service && service.id}`);
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
      renderMetaInformation={renderMetaInformation}
      renderTimeSelection={renderTimeSelection}
      hideUrlShortener
    />
  );
}

function renderContext({ getHrefToUngroupedView }) {
  return (
    <Link className={locals.analyticsLink} href={getHrefToUngroupedView()}>
      {t('in-applications:labelAnalytic')}
    </Link>
  );
}

function renderMetaInformation({ traceId, result }) {
  const displayedTraceId = result?.data?.id ?? traceId;
  return (
    <div className={locals.traceIdWrapper}>
      <span>Trace ID: </span>
      <span className={locals.traceId}>{displayedTraceId}</span>
      {displayedTraceId && role.canViewLogs && role.canViewTraceDetails && (
        <Link
          className={locals.traceLink}
          href={`/api/application-monitoring/analyze/traces;id=${encodeURIComponent(displayedTraceId)}?pretty`}
          external
        >
          <Tooltip content={t('in-applications:analyze.downloadTraceTooltip')}>
            <SvgIcon className={locals.icon} type="lib_actions_download" size="xs" />
          </Tooltip>
        </Link>
      )}
      {result.data && !result.data.id && (
        <Tooltip content={t('in-applications:analyze.traceIdTooltip')}>
          <SvgIcon className={locals.icon} type="lib_help_error_info_outline" size="xs" />
        </Tooltip>
      )}
    </div>
  );
}

function renderTimeSelection({ getHrefToUngroupedView }) {
  return (
    <Link href={getHrefToUngroupedView()}>
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

function useTraceMarker(traceId) {
  const traceViewedTimeoutHandle = useRef(null);
  useEffect(() => {
    clearTimeout(traceViewedTimeoutHandle.current);
    traceViewedTimeoutHandle.current = setTimeout(() => connection.send('traceViewed', { traceId }), 15000);
    return () => clearTimeout(traceViewedTimeoutHandle.current);
  }, [traceId]);
}
