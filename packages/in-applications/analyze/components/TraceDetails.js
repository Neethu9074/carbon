/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { empty } from '@instana/observables';
import { Button } from '@instana/components';
import { Link } from '@instana/components';

import AppNavigatorSplitScreen from 'in-analyze/TraceDetail/components/AppNavigatorSplitScreen/AppNavigatorSplitScreen';
import { traceId as traceIdMatrixParameter, callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import TracesNavigator from 'in-applications/analyze/components/TracesNavigator';
import CallsNavigator from 'in-applications/analyze/components/CallsNavigator';
import { getLinkBackToUA2FromTraceDetails } from 'in-analyze/navigation/paths';
import { colorCodeMatrixParameter } from 'in-applications/navigation/matrix';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import DashboardHeader from 'in-new-components/DashboardHeader';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { traceDetail } from 'in-analyze/navigation/paths';
import { getColor } from 'in-applications/endpointTypes';
import tabs from 'in-analyze/TraceDetail/tabs/index';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './TraceDetails.mless';

export default function TraceDetails({
  dataSource,
  getUngroupedData,
  isValid,
  order,
  hiddenCalls,
  tagFilterExpression,
  onChangeOrder
}) {
  const urlStateConfig = {
    replaceHistory: false,
    bind: [
      {
        path: traceDetail,
        name: traceIdMatrixParameter
      },
      {
        path: traceDetail,
        name: callIdMatrixParameter
      },
      colorCodeMatrixParameter
    ]
  };

  const timeConfig = useTimeConfig();

  const paginatedResult = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getUngroupedData({
            timeConfig,
            retrievalSize: 50,
            tagFilterExpression,
            order,
            cursor,
            hiddenCalls,
            dataSource
          })
        : empty,
    [timeConfig, tagFilterExpression, isValid, hiddenCalls, dataSource, order]
  );

  const byServiceEndpointCombinationUrlIdentifier = 'byServiceAndEndpoint';
  const byEndpointTypeUrlIdentifier = 'byEndpointType';

  const getColorByEndpointType = ({ endpoint }) => getColor(endpoint ? endpoint.type : 'UNDEFINED');

  const getColorByEndpoint = ({ service, endpoint, traceId }) =>
    getColorPool(traceId, theme.lib.colors.chart.strokeColors100).getColorHex(
      `${service && service.id}__${endpoint && endpoint.id}`
    );

  const [urlState, onUrlStateChange] = useUrlState(urlStateConfig);
  const traceId = urlState.traceId;
  const callId = urlState.callId;
  const colorCode = urlState.colorCode ?? byEndpointTypeUrlIdentifier;
  const onColorCodeChange = colorCode => onUrlStateChange({ colorCode });

  const props = {
    traceId,
    getColor: args => {
      const getColorBy =
        colorCode === byServiceEndpointCombinationUrlIdentifier ? getColorByEndpoint : getColorByEndpointType;
      return getColorBy({
        ...args,
        traceId
      });
    },
    setColorCodeMechanism: onColorCodeChange,
    colorCodeType: colorCode
  };

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
            icon={getIconByType(dataSource, 'application')}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
            label={getLabelByType(dataSource)}
            title={t('in-applications:labelAnalytic')}
            dataSource={dataSource}
          />
        }
      >
        <AppNavigatorSplitScreen
          navigator={
            dataSource === 'calls' ? (
              <CallsNavigator
                selectedTraceId={traceId}
                selectedCallId={callId}
                orderBy={order.by}
                orderDirection={order.direction}
                onChangeOrder={onChangeOrder}
                {...paginatedResult}
              />
            ) : (
              <TracesNavigator
                selectedTraceId={traceId}
                orderBy={order.by}
                orderDirection={order.direction}
                onChangeOrder={onChangeOrder}
                {...paginatedResult}
              />
            )
          }
          dataSource={dataSource}
          traceId={traceId}
          callId={callId}
          traceDetail={
            <TabView
              HeaderComponent={Header}
              tabs={tabs}
              result$={getTraceSummary({ id: traceId })}
              withoutBreadcrumb
              withoutPadding
              props={props}
            />
          }
        />
      </Sticky>
    </>
  );
}

function renderContext() {
  return (
    <Link className={locals.analyticsLink} href$={getLinkBackToUA2FromTraceDetails()}>
      {t('in-applications:labelAnalytic')}
    </Link>
  );
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

function renderButtonLine({ traceId, result }) {
  if (!role.canViewLogs || !role.canViewTraceDetails) {
    return null;
  }

  const traceIdInUrl = result?.data?.id ?? traceId;
  return (
    <>
      <Button
        icon="lib_actions_download"
        kind="secondary"
        target="_blank"
        href={`/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceIdInUrl)}?pretty`}
      >
        {t('in-applications:linkDownload')}
      </Button>
    </>
  );
}

function renderMetaInformation({ traceId, result }) {
  const displayedTraceId = result?.data?.id ?? traceId;
  return (
    <div>
      <span className={locals.traceIdLabel}>{t('in-applications:analyze.traceId')}</span>
      <code className={locals.traceId}>{displayedTraceId}</code>
      {// When jumping from very recent beacons to the backend traces, calls might not be
      // available in ClickHouse yet, even though some trace information from Cassandra
      // may be shown already.
      result.data && !result.data.id && (
        <Tooltip content={t('in-applications:analyze.traceIdTooltip')}>
          <SvgIcon className={locals.icon} type="lib_help_error_info_outline" size="xs" />
        </Tooltip>
      )}
    </div>
  );
}

function renderTimeSelection() {
  return (
    <Link href$={getLinkBackToUA2FromTraceDetails()}>
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
