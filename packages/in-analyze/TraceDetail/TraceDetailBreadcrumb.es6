import React from 'react';

import getTraceSummary from 'in-subscription/application/getTraceSummary';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { shorten } from 'in-services/util/string';
import connect from 'in-hoc/connectTo';

export default connect(({ traceId }) => ({
  trace: getTraceSummary({ id: traceId })
}))(function TraceDetailBreadcrumb({ trace, traceId }) {
  if (trace.data == null) {
    return <Breadcrumb label="Trace" href$={getLinkToTraceDetail(traceId)} />;
  }

  return (
    <Breadcrumb label="Trace" href$={getLinkToTraceDetail(traceId)}>
      {shorten(trace.data.label)}
    </Breadcrumb>
  );
});
