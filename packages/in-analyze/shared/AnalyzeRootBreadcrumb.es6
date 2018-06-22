import { get } from 'lodash';
import React from 'react';

import getMetrics from 'in-subscription/application/getMetrics';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { buildFilter } from 'in-analyze/shared/filterBuilder';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { number } from 'in-services/formatters/number';
import connect from 'in-hoc/connectTo';

export default connect(({ location }) => ({
  traceCountResult: getMetrics({
    filter: buildFilter(location),
    metrics: {
      traceCount: {
        metric: 'traces',
        aggregation: 'DISTINCT_COUNT'
      }
    }
  })
}))(AnalyzeRootBreadcrumb);

function AnalyzeRootBreadcrumb({ traceCountResult }) {
  let content = undefined;
  if (traceCountResult.data != null) {
    const count = get(traceCountResult, ['data', 'traceCount', 0, 1], 0);
    content = `${number.compact(count)} traces`;
  }
  return (
    <Breadcrumb label="Analyze" href$={getLinkToAnalyze()}>
      {content}
    </Breadcrumb>
  );
}
