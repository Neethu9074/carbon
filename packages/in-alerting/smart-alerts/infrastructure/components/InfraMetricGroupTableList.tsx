/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import {
  LiLoadMore,
  TableHorizontalIndicatorRow,
  Table,
  Tbody,
  SvgIcon,
  TableLoadingSkeletonRows
} from '@instana/components';
import { InfrastructureGroup, Order, Progress, Result, TagCatalog, TimeConfig } from '@instana/types';

//@ts-expect-error
import { getGroupTagValue, getMetricsColumn } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { MetricType } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { InfraMetricGroupHeader } from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroupHeader';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
//@ts-expect-error
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { sparkChartGranularity } from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import { GroupLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraGroupLabel';
//@ts-expect-error
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { Metadatas } from 'in-infrastructure/hooks/useMetricMetadatas';
import { State } from 'in-hooks/useCursorPagination';
import { getPluginName } from 'in-sdk/pluginName';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroupTableList.mless';

interface OrderByProps {
  orderBy: string;
  orderDirection: 'ASC' | 'DESC';
}

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
    order,
    retrievalSize,
    totalHits,
    fixedLayout,
    type,
    metricMetadatas,
    timeConfig,
    loadMore: defaultCursorPaginationLoadMore,
    canLoadMore,
    setBackendQueryModel,
    onOrderByChange,
    tagCatalog
  } = props;

  const hasErrors = errors && errors?.length > 0;
  const isLoading = progress && progress?.loading;
  const [selectedMetricGroup, setSelectedMetricGroup] = useState<Tags>();

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
    <>
      <div
        className={classNames({
          [locals.tableMinHeight]: items?.length >= 5
        })}
      >
        <InfraMetricGroupHeader
          isLoading={isLoading}
          totalHits={totalHits}
          setBackendQueryModel={setBackendQueryModel}
        />
        {!hasErrors && items?.length > 0 && (
          <CursorPaginatedTable
            columnDefinitions={columnDefinitions}
            numSkeletonRows={3}
            totalHits={totalHits}
            onChange={({ orderBy, orderDirection }: OrderByProps) =>
              onOrderByChange({
                by: orderBy,
                direction: orderDirection
              })
            }
            progress={progress}
            canLoadMore={canLoadMore}
            items={items}
            orderBy={order.by}
            orderDirection={order.direction}
            isSearchable={false}
            defaultPageSize={retrievalSize}
            defaultOrderDirection={order.direction}
            onRowClick={(item: InfrastructureGroup) => {
              setSelectedMetricGroup(item?.tags);
            }}
            fixedLayout={fixedLayout}
            size="compact"
          />
        )}
        {canLoadMore && (
          <LiLoadMore
            label={t('in-alerting:smartAlerts.infrastructure.loadMore')}
            //@ts-expect-error TS incompactable
            loadMore={() => {
              defaultCursorPaginationLoadMore();
            }}
          />
        )}
        {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
        {progress?.loading && items.length === 0 && <Loading progress={progress} />}
      </div>
    </>
  );
}

interface ColumnDefinitionProps {
  groupBy: string[];
  isTableMode: boolean;
  metrics: object[];
  type: string;
  metricMetadatas: Result<Metadatas>;
  timeConfig: TimeConfig;
  granularity: number;
  selectedMetricGroup?: Tags;
  tagCatalog?: TagCatalog;
}

/**
 * Returns the column definition for the infrastructure table.
 * @param groupBy The group by fields.
 * @param isTableMode Whether the table mode is enabled.
 * @param metrics The metrics.
 * @param type The type of the snapshot.
 * @param metricMetadatas The metric metadata.
 * @param timeConfig The time configuration.
 * @param granularity The granularity.
 * @param selectedGroup The selected group.
 * @returns The column definition.
 */
function getColumnDefinition({
  groupBy,
  isTableMode,
  metrics,
  type,
  metricMetadatas,
  timeConfig,
  granularity,
  selectedMetricGroup,
  tagCatalog
}: ColumnDefinitionProps) {
  const snapshotDefinition = getOptionalSnapshotDefinition(type);
  const countLabel = snapshotDefinition ? getPluginName(type, 2) : t('in-alerting:smartAlerts.infrastructure.count');

  const iconColumn = {
    width: '2rem',
    id: 'icon',
    getId: () => 'icon',
    widthInAbsoluteUnit: true,
    sortable: false,
    verticallyCenter: true,
    getContent(item: InfrastructureGroup) {
      const displayIcon = isEqual(item.tags, selectedMetricGroup);
      return (
        <SvgIcon
          type="lib_check"
          className={classNames({
            [locals.hideIcon]: !displayIcon
          })}
        />
      );
    }
  };

  const groupsColumn = groupBy.map((groupKey: string) => {
    return {
      width: getColumnWidth(groupBy, metrics),
      getId: () => groupKey,
      id: groupKey,
      cellClassName: locals.wordBreak,
      headCellProps: {
        className: locals.wordBreak
      },
      ...{
        sortable: true,
        label: groupKey && tagCatalog ? <GroupLabel groupKey={groupKey} tagCatalog={tagCatalog} /> : null,
        getContent(item: InfrastructureGroup) {
          return getGroupTagValue(item, groupKey);
        }
      }
    };
  });

  const countLabelColumnTable = {
    width: '4rem',
    id: countLabel,
    getId: () => countLabel,
    label: countLabel,
    sortable: false,
    getContent(item: InfrastructureGroup) {
      return item?.count;
    }
  };

  const metricsColumn = getMetricsColumn({ metrics, metricMetadatas, timeConfig, granularity, isTableMode });

  return [iconColumn, ...groupsColumn, countLabelColumnTable, ...metricsColumn];
}

/**
 * Returns the column width for the infrastructure table.
 * @param groupBy The group by fields.
 * @param metrics The metrics.
 * @returns The column width.
 */
function getColumnWidth(groupBy: string[], metrics: object[]): string {
  const totalMetrics = 5;
  return Math.max(1, (totalMetrics - metrics.length) / groupBy.length) * 10 + 'rem';
}

/**
 * Renders a loading indicator.
 * @param progress The progress.
 * @returns The component.
 */
function Loading({ progress }: { progress: Progress }): JSX.Element {
  return (
    <Table className={locals.fullWidth}>
      <Tbody>
        <TableHorizontalIndicatorRow cols={3} progress={progress} />
        <TableLoadingSkeletonRows cols={3} rows={6} />
      </Tbody>
    </Table>
  );
}

function setDefaultMetrics(
  items: InfrastructureGroup[],
  setSelectedMetricGroup: React.Dispatch<Tags | undefined>,
  selectedMetricGroup?: Tags
) {
  if (items?.length === 0) {
    return;
  }

  if (selectedMetricGroup) {
    const metricExistsInItems = items.find(item => item.tags === selectedMetricGroup);
    if (metricExistsInItems) {
      return;
    }
  }

  setSelectedMetricGroup(items[0].tags);
}
