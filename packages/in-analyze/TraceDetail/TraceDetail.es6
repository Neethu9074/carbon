import React, { Fragment } from 'react';

import AppNavigatorSplitScreen from 'in-analyze/TraceDetail/components/AppNavigatorSplitScreen/AppNavigatorSplitScreen';
import TraceDetailBreadcrumb from 'in-analyze/TraceDetail/TraceDetailBreadcrumb';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { traceDetail } from 'in-analyze/navigation/paths';
import { getColor } from 'in-applications/endpointTypes';
import tabs from 'in-analyze/TraceDetail/tabs/index';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';
import theme from 'in-themes';
import Sticky from 'in-components/Sticky';

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

function TraceDetail({ location, colorCode: getColor, navigator, filters, setColorCodeMechanism }) {
  const traceId = getMatrixParameter(location, traceDetail, traceIdMatrixParameter);
  const props = {
    traceId,
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
    <Fragment>
      <Sticky header={<BreadcrumbHeader useFullAvailableWidth />}>
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
              useFullAvailableWidth
              withoutPadding
            />
          }
        />
      </Sticky>
    </Fragment>
  );
}

function Header(props, filters) {
  return (
    <Fragment>
      <Breadcrumbs
        items={[
          <Breadcrumb label={getConfigByDataSource(filters.dataSource).breadcrumbLabel} href$={getLinkToAnalyze()} />,
          <TraceDetailBreadcrumb traceId={props.traceId} />
        ]}
      />
      <BasicDashboardHeader
        title="Trace"
        icon="lib_application_trace"
        renderActions={Actions}
        renderSubTypes={renderTraceId}
        {...props}
      />
      <div className={locals.tabViewPlaceholder} />
    </Fragment>
  );
}

function Actions({ traceId }) {
  return (
    <Fragment>
      <Button
        icon="lib_actions_download"
        kind="secondary"
        target="_blank"
        href={`/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceId)}?pretty`}
      >
        Download
      </Button>

      <Link href$={getLinkToAnalyze()}>
        <Tooltip content="Close trace detail">
          <SvgIcon
            className={locals.closeIcon}
            aria-label="Close trace detail"
            type="lib_openclose_cancel"
            width={24}
            height={24}
          />
        </Tooltip>
      </Link>
    </Fragment>
  );
}

function renderTraceId({ result }) {
  return (
    <div>
      <span className={locals.traceIdLabel}>Trace ID: </span>
      <code className={locals.traceId}>{result.data.id}</code>
    </div>
  );
}
