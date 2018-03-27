import React, { Fragment } from 'react';
import { compose } from 'recompose';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import TraceDetailBreadcrumb from 'in-analyze/TraceDetail/TraceDetailBreadcrumb';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import { createColorPool } from 'in-services/util/ColorGenerator';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { traceDetail } from 'in-analyze/navigation/paths';
import { getColor } from 'in-applications/endpointTypes';
import AnalyzeRoot from 'in-analyze/Analyze/AnalyzeRoot';
import TabView from 'in-new-components/TabView/TabView';
import tabs from 'in-analyze/TraceDetail/tabs/index';
import Button from 'in-new-components/Button';

const byServiceEndpointCombinationColorPool = createColorPool('serviceAndEndpointCombination');
const getColorByServiceAndEndpoint = ({ service, endpoint }) =>
  byServiceEndpointCombinationColorPool.getColorHex(`${service.id}__${endpoint.id}`);
const byServiceEndpointCombinationUrlIdentifier = 'byServiceAndEndpoint';

const getColorByEndpointType = ({ endpoint }) => getColor(endpoint.type);
const byEndpointTypeUrlIdentifier = 'byEndpointType';

export default compose(
  withUrlDependingState({
    getPathSegment: () => 'traceDetail',
    getMatrixPrefix: () => '',
    boundKeys: ['colorCode'],
    getInitialState: () => ({ colorCode: getColorByServiceAndEndpoint }),
    reducerName: 'setColorCodeMechanism',
    getParsedUrlValues: ({ colorCode }) => ({
      colorCode:
        colorCode === byServiceEndpointCombinationUrlIdentifier ? getColorByServiceAndEndpoint : getColorByEndpointType
    }),
    getSerializedUrlValues: ({ colorCode }) => ({
      colorCode:
        colorCode === getColorByServiceAndEndpoint
          ? byServiceEndpointCombinationUrlIdentifier
          : byEndpointTypeUrlIdentifier
    })
  })
)(TraceDetail);

function TraceDetail({ location, colorCode: getColor }) {
  const props = {
    traceId: getMatrixParameter(location, traceDetail, traceIdMatrixParameter),
    getColor
  };
  const { traceId } = props;

  return (
    <Fragment>
      <Breadcrumbs items={[<AnalyzeRoot location={location} />, <TraceDetailBreadcrumb traceId={traceId} />]} />
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        result$={getTraceSummary({ id: traceId })}
        props={props}
      />
    </Fragment>
  );
}

function Header(props) {
  return <BasicApplicationDashboardHeader type="Trace" renderActions={Actions} renderSubTypes={SubTypes} {...props} />;
}

function Actions({ traceId }) {
  return (
    <Button
      icon="download"
      size="compact"
      kind="secondary"
      target="_blank"
      href={`/api/analyze/traces/${encodeURIComponent(traceId)}?pretty`}
    >
      Download
    </Button>
  );
}

function SubTypes({ result }) {
  return <EndpointTypeBadgeList types={[result.data.type]} />;
}
