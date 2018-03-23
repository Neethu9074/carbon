import React, { Fragment } from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import TraceDetailBreadcrumb from 'in-analyze/TraceDetail/TraceDetailBreadcrumb';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { traceDetail } from 'in-analyze/navigation/paths';
import AnalyzeRoot from 'in-analyze/Analyze/AnalyzeRoot';
import TabView from 'in-new-components/TabView/TabView';
import tabs from 'in-analyze/TraceDetail/tabs/index';
import Button from 'in-new-components/Button';

export default function TraceDetail({ location }) {
  const props = {
    traceId: getMatrixParameter(location, traceDetail, traceIdMatrixParameter)
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
