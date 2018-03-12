import React, { Fragment } from 'react';

import TraceDetailBreadcrumb from 'in-analyze/TraceDetail/TraceDetailBreadcrumb';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import TraceDetailHeader from 'in-analyze/TraceDetail/TraceDetailHeader';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import AnalyzeRoot from 'in-analyze/breadcrumbs/AnalyzeRoot';
import getTrace from 'in-subscription/application/getTrace';
import { traceDetail } from 'in-analyze/navigation/paths';
import TabView from 'in-applications/TabView/TabView';
import tabs from 'in-analyze/TraceDetail/tabs/index';

export default function TraceDetail({ location }) {
  const props = {
    traceId: getMatrixParameter(location, traceDetail, traceIdMatrixParameter)
  };
  const { traceId } = props;

  return (
    <Fragment>
      <Breadcrumbs items={[<AnalyzeRoot />, <TraceDetailBreadcrumb traceId={traceId} />]} />
      <TabView
        HeaderComponent={TraceDetailHeader}
        location={location}
        tabs={tabs}
        result$={getTrace({ id: traceId })}
        props={props}
      />
    </Fragment>
  );
}
