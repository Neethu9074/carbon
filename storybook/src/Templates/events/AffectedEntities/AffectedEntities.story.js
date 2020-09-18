import { create } from 'reactive-observables';
import React from 'react';

import AffectedEntitiesPresenter from 'in-events/components/AffectedEntities/AffectedEntitiesPresenter';
import { indeterminateProgress, finishedProgress } from 'in-services/fixedObjects';
import { availableMetrics } from 'in-applications/analyze/metrics';

export default {
  title: 'Templates/events/AffectedEntities',
  component: AffectedEntitiesPresenter
};

export const Default = () => {
  const items = [
    {
      name: 'shipping',
      timestamp: 1594042201989,
      metrics: {
        latency_P90_Agg: [[1594043493627, 995]],
        errors_MEAN_Agg: [[1594043493627, 0]],
        totalCalls_SUM_Agg: [[1594043493627, 1337]],
        calls_SUM_Agg: [[1594043493627, 557]]
      }
    },
    {
      name: 'eum-frontend',
      timestamp: 1594042203989,
      metrics: {
        latency_P90_Agg: [[1594043493627, 8426]],
        errors_MEAN_Agg: [[1594043493627, 0.5404]],
        totalCalls_SUM_Agg: [[1594043493627, 1337]],
        calls_SUM_Agg: [[1594043493627, 470]]
      }
    },
    {
      name: 'cart',
      timestamp: 1594042219830,
      metrics: {
        latency_P90_Agg: [[1594043493627, 203]],
        errors_MEAN_Agg: [[1594043493627, 0]],
        totalCalls_SUM_Agg: [[1594043493627, 1337]],
        calls_SUM_Agg: [[1594043493627, 306]]
      }
    },
    {
      name: 'ratings',
      timestamp: 1594042201910,
      metrics: {
        latency_P90_Agg: [[1594043493627, 5124]],
        errors_MEAN_Agg: [[1594043493627, 0.1339]],
        totalCalls_SUM_Agg: [[1594043493627, 1337]],
        calls_SUM_Agg: [[1594043493627, 112]]
      }
    }
  ];

  return (
    <AffectedEntitiesPresenter
      availableMetrics={availableMetrics}
      items={items}
      createItemLink={() => create().emit('http://instana.com')}
    />
  );
};

export const Loading = () => <AffectedEntitiesPresenter items={[]} progress={indeterminateProgress} />;

export const CanLoadMore = () => (
  <AffectedEntitiesPresenter
    items={[]}
    progress={finishedProgress}
    canLoadMore
    totalHits={42}
    renderLinkToAnalyzeAll={totalCount => <p>placeholder for... Show all {totalCount} items </p>}
  />
);
