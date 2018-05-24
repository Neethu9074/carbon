import React, { Fragment } from 'react';
import { compose } from 'recompose';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import TraceDetailBreadcrumb from 'in-analyze/TraceDetail/TraceDetailBreadcrumb';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import BackToExploreBreadcrumb from 'in-analyze/shared/BackToExploreBreadcrumb';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import AnalyzeRootBreadcrumb from 'in-analyze/shared/AnalyzeRootBreadcrumb';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { traceDetail } from 'in-analyze/navigation/paths';
import { getColor } from 'in-applications/endpointTypes';
import tabs from 'in-analyze/TraceDetail/tabs/index';
import Button from 'in-new-components/Button';
import theme from 'in-themes';

import locals from './TraceDetail.mless';

const getColorByEndpointType = ({ endpoint }) => getColor(endpoint.type);
const byServiceEndpointCombinationUrlIdentifier = 'byServiceAndEndpoint';
const byEndpointTypeUrlIdentifier = 'byEndpointType';

export default compose(
  withUrlDependingState({
    getPathSegment: () => traceDetail,
    getMatrixPrefix: () => '',
    boundKeys: ['colorCode'],
    getInitialState: () => ({ colorCode: null }),
    reducerName: 'setColorCodeMechanism',
    getParsedUrlValues: ({ colorCode }) => ({
      colorCode: colorCode === byServiceEndpointCombinationUrlIdentifier ? null : getColorByEndpointType
    }),
    getSerializedUrlValues: ({ colorCode }) => ({
      colorCode: !colorCode ? byServiceEndpointCombinationUrlIdentifier : byEndpointTypeUrlIdentifier
    })
  })
)(TraceDetail);

function TraceDetail({ location, colorCode: getColor }) {
  const props = {
    traceId: getMatrixParameter(location, traceDetail, traceIdMatrixParameter)
  };
  const { traceId } = props;

  props.getColor = getColor
    ? getColor
    : ({ service, endpoint }) =>
        getColorPool(traceId, theme.lib.colors.chart.strokeColors100).getColorHex(`${service.id}__${endpoint.id}`);

  return (
    <Fragment>
      <Breadcrumbs
        items={[
          <BackToExploreBreadcrumb />,
          <AnalyzeRootBreadcrumb location={location} />,
          <TraceDetailBreadcrumb traceId={traceId} />
        ]}
      />
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
  return (
    <div>
      <BasicApplicationDashboardHeader type="Trace" renderActions={Actions} renderSubTypes={SubTypes} {...props} />
      <div className={locals.tabViewPlaceholder} />
    </div>
  );
}

function Actions({ traceId }) {
  return (
    <Button
      icon="lib_actions_download"
      kind="secondary"
      target="_blank"
      href={`/api/analyze/traces/${encodeURIComponent(traceId)}?pretty`}
    >
      Download
    </Button>
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <EndpointTypeBadgeList types={[result.data.type]} />
      <TechnologyIndicatorList technologies={result.data.technologies} />
    </Fragment>
  );
}
