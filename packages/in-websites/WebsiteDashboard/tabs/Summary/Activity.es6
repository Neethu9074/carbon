import { compose, withState } from 'recompose';
import React from 'react';

import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import Select from 'in-components/form/Select';

const labels = {
  pageViews: 'Page Views',
  pageLoads: 'Page Loads',
  pageTransitions: 'Page Transitions'
};

export default compose(withState('metric', 'setMetric', null))(function Activity({
  timeConfig,
  tagFilters,
  granularity,
  metric,
  setMetric,
  pageId
}) {
  metric = metric || (pageId ? 'pageViews' : 'pageLoads');
  return (
    <WebsiteChartWrapper
      cardTitle="Activity"
      cardHeader={
        <Select value={metric} onChange={e => setMetric(e.target.value || 'pageLoads')}>
          {Object.keys(labels).map(m => (
            <option value={m} key={m}>
              {labels[m]}
            </option>
          ))}
        </Select>
      }
      renderLegend={false}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.bar,
        formatter: number.forcedCompact,
        labels: [labels[metric]],
        metricIds: [metric]
      }}
      metricsConfiguration={{
        timeConfig,
        tagFilters,
        metrics: {
          [metric]: {
            metric: metric,
            granularity,
            aggregation: 'SUM'
          }
        }
      }}
    />
  );
});
