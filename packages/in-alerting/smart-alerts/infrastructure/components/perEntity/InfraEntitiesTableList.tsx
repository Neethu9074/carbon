/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

//@ts-expect-error TS migration needed
import { setDefaultEntity } from 'in-alerting/smart-alerts/infrastructure/data/alertConfigUtils';
import {
  MetricType,
  Tags
} from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { getColumnDefinition } from 'in-alerting/smart-alerts/infrastructure/components/perEntity/getColumnDefinition';
import GroupTableList from 'in-alerting/smart-alerts/aggregated/components/GroupTableList';
import { InfrastructureExploreItem, Order, Result, TimeConfig } from 'in-types';
import { getGranularity } from 'in-infrastructure/Explore/services/metrics';
import { Metadatas } from 'in-infrastructure/hooks/useMetricMetadatas';
import { State } from 'in-hooks/useCursorPagination';

interface InfraEntitiesTableListProps extends State<any, any> {
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
  setSelectedMetricGroup: React.Dispatch<React.SetStateAction<Tags | null>>;
}

export default function InfraEntitiesTableList(props: InfraEntitiesTableListProps) {
  const {
    errors,
    progress,
    items,
    metrics,
    type,
    retrievalSize,
    metricMetadatas,
    timeConfig,
    loadMore,
    setSelectedMetricGroup
  } = props;

  const hasErrors = errors && errors?.length > 0;
  const isLoading = progress && progress?.loading;
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>();

  useEffect(() => {
    if (items?.length > 0) {
      setDefaultEntity(items, setSelectedSnapshotId, selectedSnapshotId);
    } else {
      // if the loading is completed and the item is empty set the selected metric group to null
      setSelectedSnapshotId(undefined);
      setSelectedMetricGroup(null);
    }

    if (selectedSnapshotId) {
      const snapshotFilterKey = `id.${type}`;
      setSelectedMetricGroup({ [snapshotFilterKey]: selectedSnapshotId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSnapshotId, items, isLoading, type]);

  const columnDefinitions = getColumnDefinition({
    metrics,
    sortable: true,
    metricMetadatas,
    timeConfig,
    granularity: getGranularity(timeConfig),
    selectedSnapshotId
  });

  return (
    <GroupTableList<InfrastructureExploreItem>
      {...props}
      isLoading={isLoading}
      hasErrors={hasErrors}
      columnDefinitions={columnDefinitions}
      retrievalSize={retrievalSize}
      setSelectedMetricGroup={(item: InfrastructureExploreItem) => setSelectedSnapshotId(item.snapshotId)}
      loadMore={loadMore}
    />
  );
}
