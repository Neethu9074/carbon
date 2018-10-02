import React, { Fragment } from 'react';
import { compose } from 'recompose';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import TraceDetailBreadcrumb from 'in-analyze/TraceDetail/TraceDetailBreadcrumb';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
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
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';
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

function TraceDetail({ location, colorCode: getColor, navigator, isTracesDataSource }) {
  const props = {
    traceId: getMatrixParameter(location, traceDetail, traceIdMatrixParameter)
  };
  const { traceId } = props;

  const breadcrumbLabel = isTracesDataSource ? 'Analyze Traces' : 'Analyze Calls';

  props.getColor = getColor
    ? getColor
    : ({ service, endpoint }) =>
        getColorPool(traceId, theme.lib.colors.chart.strokeColors100).getColorHex(`${service.id}__${endpoint.id}`);

  return (
    <Fragment>
      <Breadcrumbs
        items={[
          <Breadcrumb label={breadcrumbLabel} href$={getLinkToAnalyze()} />,
          <TraceDetailBreadcrumb traceId={traceId} />
        ]}
      />
      <BreadcrumbHeader />

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
          />
        }
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
        <SvgIcon
          className={locals.closeIcon}
          aria-label="Close sidebar"
          type="lib_openclose_cancel"
          width={24}
          height={24}
        />
      </Link>
    </Fragment>
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
