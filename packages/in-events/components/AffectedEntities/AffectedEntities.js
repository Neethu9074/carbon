/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';
import React from 'react';

import AffectedEntitiesPresenter from 'in-events/components/AffectedEntities/AffectedEntitiesPresenter';
import getCallGroups from 'in-subscription/application/getCallGroups';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { entityTypes } from 'in-analyze/applicationFilter';

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
    totalTagFilters,
    totalTagFilterExpression
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
        tagFilters: tagFilters,
        tagFilterExpression: tagFilterExpression,
        pagination: {
          cursor,
          retrievalSize: 20
        }
      });
      const allEntities = getCallGroups({
        ...baseQueryParameters,
        tagFilters: totalTagFilters,
        tagFilterExpression: totalTagFilterExpression,
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
