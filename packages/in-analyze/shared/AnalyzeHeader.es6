import { assign, get } from 'lodash';
import React from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getMetrics from 'in-subscription/application/getMetrics';
import { buildFilter } from 'in-analyze/shared/filterBuilder';
import { number } from 'in-services/formatters/number';
import connect from 'in-hoc/connectTo';

import locals from './AnalyzeHeader.mless';

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
}))(AnalyzeHeader);

function AnalyzeHeader({ traceCountResult }) {
  let result = traceCountResult;
  if (traceCountResult.data != null) {
    const count = get(traceCountResult, ['data', 'traceCount', 0, 1], 0);
    result = assign({}, traceCountResult, {
      data: {
        label: `${number.compact(count)} Traces`
      }
    });
  }
  return (
    <div className={locals.analyzeHeader}>
      <MaxWidthFullscreenContainer>
        <BasicApplicationDashboardHeader type="Trace" result={result} />
      </MaxWidthFullscreenContainer>
    </div>
  );
}
