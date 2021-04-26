/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import AppNavigatorSplitScreen from 'in-analyze/TraceDetail/components/AppNavigatorSplitScreen/AppNavigatorSplitScreen';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { traceDetail } from 'in-analyze/navigation/paths';
import { getColor } from 'in-applications/endpointTypes';
import tabs from 'in-analyze/TraceDetail/tabs/index';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';
import Link from 'in-components/Link';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './TraceDetail.mless';

const getColorByEndpointType = ({ endpoint }) => getColor(endpoint ? endpoint.type : 'UNDEFINED');
const getColorByEndpoint = ({ service, endpoint, traceId }) =>
  getColorPool(traceId, theme.lib.colors.chart.strokeColors100).getColorHex(
    `${service && service.id}__${endpoint && endpoint.id}`
  );
const byServiceEndpointCombinationUrlIdentifier = 'byServiceAndEndpoint';
const byEndpointTypeUrlIdentifier = 'byEndpointType';

export default withUrlDependingState({
  getPathSegment: () => traceDetail,
  getMatrixPrefix: () => '',
  boundKeys: ['colorCode'],
  getInitialState: () => ({ colorCode: getColorByEndpointType }),
  reducerName: 'setColorCodeMechanism',
  reducer: (state, newColorCoding) => ({
    ...state,
    colorCode:
      newColorCoding === byServiceEndpointCombinationUrlIdentifier ? getColorByEndpoint : getColorByEndpointType
  }),
  getParsedUrlValues: ({ colorCode }) => ({
    colorCode: colorCode === byServiceEndpointCombinationUrlIdentifier ? getColorByEndpoint : getColorByEndpointType
  }),
  getSerializedUrlValues: ({ colorCode }) => ({
    colorCode:
      colorCode === getColorByEndpoint ? byServiceEndpointCombinationUrlIdentifier : byEndpointTypeUrlIdentifier
  })
})(TraceDetail);

function TraceDetail({ location, colorCode: getColor, navigator, filters, setColorCodeMechanism, dataSource }) {
  const traceId = getMatrixParameter(location, traceDetail, traceIdMatrixParameter);
  const props = {
    traceId,
    filters,
    getColor: args =>
      getColor({
        ...args,
        traceId
      }),
    setColorCodeMechanism,
    colorCodeType:
      getColor === getColorByEndpoint ? byServiceEndpointCombinationUrlIdentifier : byEndpointTypeUrlIdentifier
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: t('in-analyze:traceDetail.applications'),
          pageRootName: t('in-analyze:traceDetail.analytics')
        }}
      />

      <Sticky
        header={
          <DashboardHeader
            {...props}
            icon={getIconByType(dataSource, 'application')}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
            label={getLabelByType(dataSource)}
            title={t('in-analyze:traceDetails.titleAnalytics')}
          />
        }
      >
        <AppNavigatorSplitScreen
          navigator={navigator}
          dataSource={filters.dataSource}
          traceDetail={
            <TabView
              HeaderComponent={Header}
              location={location}
              tabs={tabs}
              result$={getTraceSummary({ id: traceId })}
              props={props}
              withoutBreadcrumb
              withoutPadding
            />
          }
        />
      </Sticky>
    </>
  );
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-analyze:traceDetails.titleTrace')}
      icon="lib_application_trace"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
      renderTimeSelection={renderTimeSelection}
      hideUrlShortener
    />
  );
}

function renderButtonLine({ traceId }) {
  if (!role.canViewLogs || !role.canViewTraceDetails) {
    return null;
  }

  return (
    <>
      <Button
        icon="lib_actions_download"
        kind="secondary"
        target="_blank"
        href={`/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceId)}?pretty`}
      >
        {t('in-analyze:traceDetail.download')}
      </Button>
    </>
  );
}

function renderMetaInformation({ traceId, result }) {
  return (
    <div>
      <span className={locals.traceIdLabel}>{t('in-analyze:traceDetail.traceId')}</span>
      <code className={locals.traceId}>{traceId}</code>
      {// When jumping from very recent beacons to the backend traces, calls might not be
      // available in ClickHouse yet, even though some trace information from Cassandra
      // may be shown already.
      result.data && !result.data.id && (
        <Tooltip content={t('in-analyze:traceDetails.tooltipData')}>
          <SvgIcon className={locals.icon} type="lib_help_error_info_outline" size="xs" />
        </Tooltip>
      )}
    </div>
  );
}

function renderContext({ filters }) {
  return (
    <Link className={locals.analyticsLink} href$={getLinkToAnalyze({ dataSource: filters.dataSource })}>
      {t('in-analyze:traceDetail.analytics')}
    </Link>
  );
}

function renderTimeSelection({ filters }) {
  return (
    <Link href$={getLinkToAnalyze({ dataSource: filters.dataSource })}>
      <Tooltip content={t('in-analyze:traceDetails.tooltipClose')}>
        <SvgIcon
          className={locals.closeIcon}
          aria-label={t('in-analyze:traceDetail.closeTraceDetail')}
          type="lib_openclose_cancel"
        />
      </Tooltip>
    </Link>
  );
}
