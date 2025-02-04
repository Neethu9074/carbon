/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { Order, Result, TagCatalog, TimeConfig } from '@instana/types';

//@ts-expect-error TS migration needed
import { setDefaultMetrics } from 'in-alerting/smart-alerts/infrastructure/data/alertConfigUtils';
import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { MetricType } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { sparkChartGranularity } from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import { getColumnDefinition } from 'in-alerting/smart-alerts/infrastructure/data/getColumnDefinition';
import GroupTableList from 'in-alerting/smart-alerts/aggregated/components/GroupTableList';
import { Metadatas } from 'in-infrastructure/hooks/useMetricMetadatas';
import { State } from 'in-hooks/useCursorPagination';

interface InfraMetricGroupTableListProps extends State<any, any> {
  groupBy: string[];
  isTableMode: boolean;
  metrics: MetricType[];
  order: Order;
  retrievalSize: number;
  totalHits?: number;
  fixedLayout?: boolean;
  type: string;
  metricMetadatas: Result<Metadatas>;
  timeConfig: TimeConfig;
  loadMore: () => void;
  canLoadMore: boolean;
  setBackendQueryModel: (arg?: string) => void;
  onOrderByChange: ({ by, direction }: Order) => void;
  tagCatalog?: TagCatalog;
}

/**
 * Renders the infrastructure metric group table list.
 * @param props The props.
 * @returns The component.
 */

export default function InfraMetricGroupTableList(props: InfraMetricGroupTableListProps) {
  const {
    errors,
    progress,
    groupBy,
    isTableMode,
    items,
    metrics,
    retrievalSize,
    type,
    metricMetadatas,
    timeConfig,
    loadMore,
    tagCatalog
  } = props;

  const hasErrors = errors && errors?.length > 0;
  const isLoading = progress && progress?.loading;
  const [selectedMetricGroup, setSelectedMetricGroup] = useState<Tags>();

  useEffect(() => {
    if (isLoading) {
      selectedMetricGroup$.emit({ loading: true });
      return;
    }

    if (items?.length > 0) {
      // If the value is not in the'selectedMetricGroup', set the first one as selected by default.
      setDefaultMetrics(items, setSelectedMetricGroup, selectedMetricGroup);
    } else {
      // if the loading is completed and the item is empty set the selected metric group to null
      setSelectedMetricGroup(undefined);
      selectedMetricGroup$.emit(null);
    }

    if (selectedMetricGroup) {
      selectedMetricGroup$.emit(selectedMetricGroup);
    }
  }, [selectedMetricGroup, items, isLoading]);

  const columnDefinitions = getColumnDefinition({
    groupBy,
    isTableMode,
    metrics,
    type,
    metricMetadatas,
    timeConfig,
    granularity: sparkChartGranularity,
    selectedMetricGroup,
    tagCatalog
  });

  return (
    <GroupTableList
      {...props}
      isLoading={isLoading}
      hasErrors={hasErrors}
      columnDefinitions={columnDefinitions}
      retrievalSize={retrievalSize}
      setSelectedMetricGroup={setSelectedMetricGroup}
      loadMore={loadMore}
    />
  );
}
