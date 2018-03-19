import React from 'react';

import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getTrace from 'in-subscription/application/getTrace';
import { shorten } from 'in-services/util/string';
import connect from 'in-hoc/connectTo';

export default connect(({ traceId }) => ({
  trace: getTrace({ id: traceId })
}))(function TraceDetailBreadcrumb({ trace, traceId }) {
  if (trace.data == null) {
    return <Breadcrumb label="Trace" href$={getLinkToTraceDetail(traceId)} />;
  }

  return (
    <Breadcrumb label="Trace" href$={getLinkToTraceDetail(traceId)}>
      {shorten(trace.data.rootSpan.label)}
    </Breadcrumb>
  );
});
