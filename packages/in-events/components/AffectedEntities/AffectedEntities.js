import { combineLatest } from 'reactive-observables';
import React from 'react';

import AffectedEntitiesPresenter from 'in-events/components/AffectedEntities/AffectedEntitiesPresenter';
import { entityTypes, getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getCallGroups from 'in-subscription/application/getCallGroups';
import useCursorPagination from 'in-hooks/useCursorPagination';

export default function AffectedEntities(props) {
  const {
    timeConfig,
    retrievalSize,
    filterGroup,
    tagFilters,
    tagFilterExpression,
    orderBy,
    isValid,
    hiddenCalls,
    totalFilters
  } = props;

  const tableProps = useCursorPagination(
    ({ cursor }) => {
      const baseQueryParameters = {
        order: {
          by: 'calls_SUM_Agg',
          direction: 'DESC'
        },
        filter: {
          timeConfig
        },
        metrics: {
          calls_SUM_Agg: {
            metric: 'calls',
            aggregation: 'SUM'
          }
        },
        group: {
          groupbyTag: filterGroup.name ?? null,
          groupbyTagSecondLevelKey: filterGroup.value ?? '',
          groupbyTagEntity: filterGroup.entity ?? entityTypes.NOT_APPLICABLE
        },
        queryPrecision: 'FULL'
      };

      const affected = getCallGroups({
        ...baseQueryParameters,
        tagFilters: getTagFilterListForBackendSubscription(tagFilters),
        pagination: {
          cursor,
          retrievalSize: 20
        }
      });
      const allEntities = getCallGroups({
        ...baseQueryParameters,
        tagFilters: getTagFilterListForBackendSubscription(totalFilters),
        pagination: {
          cursor,
          retrievalSize: 200
        }
      });

      return combineLatest([affected, allEntities]).map(enrichMetricResults);
    },
    [timeConfig, retrievalSize, tagFilterExpression, orderBy, isValid, hiddenCalls]
  );

  return <AffectedEntitiesPresenter {...props} {...tableProps} />;
}

function enrichMetricResults([affected, total]) {
  const loading = affected.progress?.loading || total.progress?.loading;
  const dataWithTotalCounts = enrichItemsWithTotalCounts(affected.data, total.data);
  return {
    ...affected,
    errors: [...affected.errors, ...total.errors],
    data: loading ? undefined : dataWithTotalCounts,
    progress: {
      ...affected.progress,
      loading: loading
    }
  };
}

function enrichItemsWithTotalCounts(affectedCalls = {}, total = {}) {
  function enrichWithCallsForEntityWithSameName(entity) {
    const totalMetric = total?.items?.find(totalEntry => totalEntry.name === entity.name)?.metrics?.calls_SUM_Agg;
    if (totalMetric) {
      return {
        ...entity,
        metrics: {
          ...entity.metrics,
          totalCalls_SUM_Agg: totalMetric
        }
      };
    }
    return entity;
  }

  return {
    ...affectedCalls,
    items: affectedCalls?.items?.map(enrichWithCallsForEntityWithSameName)
  };
}
