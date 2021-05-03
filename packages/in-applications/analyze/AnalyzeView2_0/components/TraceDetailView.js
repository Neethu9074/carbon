/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { get } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import SplitScreenTraceDetailContent from 'in-applications/analyze/AnalyzeView2_0/components/SplitScreenTraceDetailContent';
import SplitScreenList from 'in-new-components/AnalyzeView/SplitScreenList/SplitScreenList';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import tabs from 'in-applications/analyze/AnalyzeView2_0/components/tabs';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { getColor } from 'in-applications/endpointTypes';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './TraceDetailView.mless';

export default function TraceDetailView(props) {
  const dataSource = props.dataSource;

  const {
    detailId: { callId, traceId, colorCode, logId },
    getHrefToDetailId
  } = props;

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

function renderButtonLine({ traceId, result }) {
  if (!role.canViewLogs || !role.canViewTraceDetails) {
    return null;
  }

  const traceIdInUrl = result?.data?.id ?? traceId;
  return (
    <Button
      icon="lib_actions_download"
      kind="secondary"
      target="_blank"
      href={`/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceIdInUrl)}?pretty`}
    >
      {t('in-applications:linkDownload')}
    </Button>
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
    <div>
      <span className={locals.traceIdLabel}>Trace ID: </span>
      <code className={locals.traceId}>{displayedTraceId}</code>
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
