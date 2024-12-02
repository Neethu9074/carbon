/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonLayer, LiLoadMore } from '@instana/components';

//@ts-expect-error
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import MetricGroupHeader from 'in-alerting/smart-alerts/aggregated/components/MetricGroupHeader';
import TableLoading from 'in-alerting/smart-alerts/aggregated/components/TableLoading';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { InfrastructureGroup, LogGroupItem, Order } from 'in-types';
import { State } from 'in-hooks/useCursorPagination';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/aggregated/components/GroupTableList.mless';

interface GroupTableListProps extends State<any, any> {
  isLoading: boolean;
  hasErrors: boolean;
  order?: Order;
  columnDefinitions: any;
  retrievalSize: number;
  totalHits?: number;
  fixedLayout?: boolean;
  loadMore: () => void;
  canLoadMore: boolean;
  setBackendQueryModel: (arg?: string) => void;
  setSelectedMetricGroup: any;
  onOrderByChange?: ({ by, direction }: Order) => void;
}

type GroupItem = LogGroupItem | InfrastructureGroup;

export default function GroupTableList({
  items,
  isLoading,
  totalHits,
  hasErrors,
  order,
  columnDefinitions,
  setBackendQueryModel,
  progress,
  canLoadMore,
  retrievalSize,
  setSelectedMetricGroup,
  fixedLayout,
  loadMore: defaultCursorPaginationLoadMore,
  onOrderByChange
}: GroupTableListProps) {
  return (
    <>
      <div
        className={classNames({
          [locals.tableMinHeight]: items?.length >= 5
        })}
      >
        <MetricGroupHeader isLoading={isLoading} totalHits={totalHits} setBackendQueryModel={setBackendQueryModel} />
        {!hasErrors && items?.length > 0 && (
          <CarbonLayer>
            <CursorPaginatedTable
              columnDefinitions={columnDefinitions}
              numSkeletonRows={3}
              totalHits={totalHits}
              onChange={({ orderBy, orderDirection }: { orderBy: string; orderDirection: 'ASC' | 'DESC' }) =>
                onOrderByChange &&
                onOrderByChange({
                  by: orderBy,
                  direction: orderDirection
                })
              }
              progress={progress}
              canLoadMore={canLoadMore}
              items={items}
              isSearchable={false}
              defaultPageSize={retrievalSize}
              defaultOrderDirection={order && order.direction}
              orderBy={order?.by}
              orderDirection={order?.direction}
              onRowClick={(item: GroupItem) => {
                setSelectedMetricGroup('label' in item ? item?.label : 'tags' in item ? item?.tags : '');
              }}
              fixedLayout={fixedLayout}
              size="compact"
            />
          </CarbonLayer>
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
