/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { Group } from '@instana/types';

import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import { getColumnDefinition } from 'in-alerting/smart-alerts/logs/data/getColumnDefinition';
import { setDefaultMetrics } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import GroupTableList from 'in-alerting/smart-alerts/aggregated/components/GroupTableList';
import { CatalogResponse } from 'in-logging/api/catalog';
import { State } from 'in-hooks/useCursorPagination';
import { LogGroupItem } from 'in-types';

interface LogMetricGroupTableListProps extends State<any, any> {
  groupBy: Group[];
  retrievalSize: number;
  totalHits?: number;
  fixedLayout?: boolean;
  loadMore: () => void;
  tagCatalog?: CatalogResponse;
  canLoadMore: boolean;
  setBackendQueryModel: (arg?: string) => void;
}

/**
 * Renders the Logs group table list.
 */

export default function LogMetricGroupTableList(props: LogMetricGroupTableListProps) {
  const { errors, progress, groupBy, items, retrievalSize, loadMore, tagCatalog } = props;

  const hasErrors = errors && errors?.length > 0;
  const isLoading = progress && progress?.loading;
  const [selectedMetricGroup, setSelectedMetricGroup] = useState<any>();

  useEffect(() => {
    if (isLoading) return;

    if (items?.length > 0) {
      // If the value is not in the'selectedMetricGroup', set the first one as selected by default.
      setDefaultMetrics(items, setSelectedMetricGroup, selectedMetricGroup);
    } else {
      // if the loading is completed and the item is empty set the selected metric group to null
      setSelectedMetricGroup(undefined);
      selectedMetricGroup$.emit(null);
    }

    if (selectedMetricGroup) {
      selectedMetricGroup$.emit({ ...groupBy[0], groupbyValue: selectedMetricGroup });
    }
  }, [selectedMetricGroup, items, isLoading, groupBy]);

  const columnDefinitions = getColumnDefinition({
    groupBy,
    selectedMetricGroup,
    tagCatalog
  });

  return (
    <GroupTableList<LogGroupItem>
      {...props}
      isLoading={isLoading}
      hasErrors={hasErrors}
      columnDefinitions={columnDefinitions}
      retrievalSize={retrievalSize}
      setSelectedMetricGroup={(item: LogGroupItem) => setSelectedMetricGroup(item.label)}
      loadMore={loadMore}
    />
  );
}
