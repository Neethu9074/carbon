/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { create } from '@instana/observables';
import { Link } from '@instana/components';

import AffectedEntitiesPresenter from 'in-events/components/AffectedEntities/AffectedEntitiesPresenter';
import { indeterminateProgress, finishedProgress } from 'in-services/fixedObjects';
import { availableMetrics } from 'in-applications/analyze/metrics';

export default {
  component: AffectedEntitiesPresenter
};

export const Default = {
  args: {
    items: [
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
    ],
    progress: finishedProgress,
    availableMetrics: availableMetrics,
    createItemLink: () => create().emit('http://instana.com')
  }
};

export const Loading = {
  args: { items: [], progress: indeterminateProgress }
};

export const CanLoadMore = {
  args: {
    items: [
      {
        name: 'shipping',
        timestamp: 1594042201989,
        metrics: {
          latency_P90_Agg: [[1594043493627, 995]],
          errors_MEAN_Agg: [[1594043493627, 0]],
          totalCalls_SUM_Agg: [[1594043493627, 1337]],
          calls_SUM_Agg: [[1594043493627, 557]]
        }
      }
    ],
    progress: finishedProgress,
    canLoadMore: true,
    totalHits: 42,
    renderLinkToAnalyzeAll: totalCount => <Link href="#">Show all {totalCount} items </Link>
  }
};
