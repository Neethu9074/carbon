/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import { AggregationType } from '@instana/types/typeDefinitions';

import InfraEntitiesTableList from 'in-alerting/smart-alerts/infrastructure/components/perEntity/InfraEntitiesTableList';
import { MetricType } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { getEntitiesData } from 'in-alerting/smart-alerts/infrastructure/components/perEntity/getEntitiesData';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { Order, TagFilterExpressionElementUnion, TimeConfig, InfraExploreCursor, Result } from 'in-types';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getMetricKey } from 'in-infrastructure/Explore/services/metrics';
import { Metadatas } from 'in-infrastructure/hooks/useMetricMetadatas';
import useCursorPagination from 'in-hooks/useCursorPagination';

const retrievalSize = 5;

interface InfraEntityListProps {
  backendQueryModel: TagFilterExpressionElementUnion;
  order: Order;
  timeConfig: TimeConfig;
  metricMetadatas: Result<Metadatas>;
  aggregation: AggregationType;
  crossSeriesAggregation: AggregationType;
  entityType: string;
  metricName: string;
  regex: boolean;
}

export default function InfraEntityList(props: InfraEntityListProps) {
  const { backendQueryModel, order, timeConfig, entityType, aggregation, crossSeriesAggregation, metricName, regex } =
    props;

  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);
  const metricInfo: MetricType = {
    metric: metricName,
    aggregation,
    crossSeriesAggregation,
    regex,
    label: metricLabel
  };

  const [filterExpression, setFilterExpression] = useState<TagFilterExpressionElementUnion>(backendQueryModel);
  const [orderByDirection, setOrderByDirection] = useState(order);

  const timeConfigJson = JSON.stringify(timeConfig);
  const filterExpressionJSON = JSON.stringify(filterExpression);

  useEffect(() => {
    setFilterExpression(backendQueryModel);
  }, [backendQueryModel]);

  const id = getMetricKey(metricName, aggregation, crossSeriesAggregation);

  const { totalHits, ...cursorPaginatedProps } = useCursorPagination<InfraExploreCursor, any>(
    ({ cursor }) =>
      getEntitiesData({
        timeConfig,
        backendQueryModel: filterExpression,
        metricInfo,
        retrievalSize,
        id,
        order: orderByDirection,
        type: entityType,
        cursor
      }),
    [timeConfigJson, filterExpressionJSON, orderByDirection, entityType, aggregation, crossSeriesAggregation]
  );

  /**
   * Handles the order by change.
   * @param orderBy The order by value with field and direction .
   */
  function onOrderByChange(orderBy: Order) {
    setOrderByDirection(orderBy);
  }

  return (
    <InfraEntitiesTableList
      retrievalSize={retrievalSize}
      type={entityType}
      metrics={[metricInfo]}
      fixedLayout
      totalHits={totalHits}
      {...props}
      {...cursorPaginatedProps}
      order={orderByDirection}
      setBackendQueryModel={(searchBy?: string) =>
        setBackendQueryModel(backendQueryModel, setFilterExpression, searchBy)
      }
      onOrderByChange={onOrderByChange}
    />
  );
}

function setBackendQueryModel(
  backendQueryModel: TagFilterExpressionElementUnion,
  setFilterExpression: any,
  searchBy?: string
) {
  if (searchBy) {
    const searchQuery = tagFilter('label', CONTAINS, searchBy, null, NOT_APPLICABLE);

    if (backendQueryModel?.type === 'TAG_FILTER' || backendQueryModel?.elements?.length > 0) {
      const searchQueryModel = addTagFilters(searchQuery, [backendQueryModel]);

      setFilterExpression(searchQueryModel);
      return;
    } else {
      setFilterExpression(searchQuery);
      return;
    }
  }

  setFilterExpression(backendQueryModel);
}
