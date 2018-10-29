import React, { Fragment } from 'react';
import { compose } from 'recompose';

import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import TraceDetailBreadcrumb from 'in-analyze/TraceDetail/TraceDetailBreadcrumb';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
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

import locals from './TraceDetail.mless';

const getColorByEndpointType = ({ endpoint }) => getColor(endpoint.type);
const getColorByEndpoint = ({ service, endpoint, traceId }) =>
  getColorPool(traceId, theme.lib.colors.chart.strokeColors100).getColorHex(`${service.id}__${endpoint.id}`);
const byServiceEndpointCombinationUrlIdentifier = 'byServiceAndEndpoint';
const byEndpointTypeUrlIdentifier = 'byEndpointType';

export default compose(
  withUrlDependingState({
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
  })
)(TraceDetail);

function TraceDetail({ location, colorCode: getColor, navigator, isTracesDataSource, setColorCodeMechanism }) {
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
  const breadcrumbLabel = isTracesDataSource ? 'Analyze Traces' : 'Analyze Calls';

  return (
    <Fragment>
      <Breadcrumbs
        items={[
          <Breadcrumb label={breadcrumbLabel} href$={getLinkToAnalyze()} />,
          <TraceDetailBreadcrumb traceId={traceId} />
        ]}
      />
      <BreadcrumbHeader useFullAvailableWidth />

      <NavigatorSplitScreen
        navigator={navigator}
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
    </Fragment>
  );
}

function Header(props) {
  return (
    <div>
      <BasicDashboardHeader title="Trace" icon="lib_application_trace" renderActions={Actions} {...props} />
      <div className={locals.tabViewPlaceholder} />
    </div>
  );
}

function Actions({ traceId }) {
  return (
    <Fragment>
      <Button
        icon="lib_actions_download"
        kind="secondary"
        target="_blank"
        href={`/api/analyze/traces/${encodeURIComponent(traceId)}?pretty`}
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
