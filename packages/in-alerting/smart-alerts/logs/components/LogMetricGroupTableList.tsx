/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { LiLoadMore } from '@instana/components';

//@ts-expect-error
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import MetricGroupHeader from 'in-alerting/smart-alerts/aggregated/components/MetricGroupHeader';
import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import { getColumnDefinition } from 'in-alerting/smart-alerts/logs/data/getColumnDefinition';
import { setDefaultMetrics } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import TableLoading from 'in-alerting/smart-alerts/aggregated/components/TableLoading';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { CatalogResponse } from 'in-logging/api/catalog';
import { State } from 'in-hooks/useCursorPagination';
import { LogGroupItem } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/components/LogMetricGroupTableList.mless';

interface LogMetricGroupTableListProps extends State<any, any> {
  groupBy: string[];
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
  const {
    errors,
    progress,
    groupBy,
    items,
    retrievalSize,
    totalHits,
    fixedLayout,
    loadMore: defaultCursorPaginationLoadMore,
    canLoadMore,
    setBackendQueryModel,
    tagCatalog
  } = props;

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
      selectedMetricGroup$.emit({ [groupBy[0]]: selectedMetricGroup });
    }
  }, [selectedMetricGroup, items, isLoading, groupBy]);

  const columnDefinitions = getColumnDefinition({
    groupBy,
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
        <MetricGroupHeader isLoading={isLoading} totalHits={totalHits} setBackendQueryModel={setBackendQueryModel} />
        {!hasErrors && items?.length > 0 && (
          <CursorPaginatedTable
            columnDefinitions={columnDefinitions}
            numSkeletonRows={3}
            totalHits={totalHits}
            onChange={() => undefined}
            progress={progress}
            canLoadMore={canLoadMore}
            items={items}
            isSearchable={false}
            defaultPageSize={retrievalSize}
            onRowClick={(item: LogGroupItem) => {
              setSelectedMetricGroup(item?.label);
            }}
            fixedLayout={fixedLayout}
            size="compact"
          />
        )}
        {canLoadMore && (
          <LiLoadMore
            label={t('in-alerting:components.loadMore')}
            //@ts-expect-error TS incompactable
            loadMore={() => {
              defaultCursorPaginationLoadMore();
            }}
          />
        )}
        {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
        {progress?.loading && items.length === 0 && <TableLoading progress={progress} />}
      </div>
    </>
  );
}
