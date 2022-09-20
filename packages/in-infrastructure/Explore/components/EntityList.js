/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getGroupTagValue } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { pagesLoaded } from 'in-infrastructure/Explore/components/InfrastructureList';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import { getLinkToExplore } from 'in-infrastructure/navigation/paths';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

export default function EntityList({
  retrievalSize = 20,
  numSkeletonRows = 3,
  backendQueryModel,
  timeConfig,
  setOrder = noop,
  order,
  type,
  tracking,
  onMovingFromInitPage
}) {
  const {
    items,
    totalHits,
    loadMore: cursorPaginationDefaultLoadMore,
    cursor,
    errors,
    progress,
    ...tableProps
  } = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, retrievalSize, backendQueryModel, order, type, cursor }),
    [timeConfig, retrievalSize, backendQueryModel, type, order]
  );

  const columnDefinitions = [
    {
      id: 'label',
      width: '8rem',
      label: t('in-infrastructure:explore.name'),
      getContent(item) {
        const value = getGroupTagValue(item, 'type');
        return (
          <div>
            <EntityLink
              label={value}
              plugin={item.tags['type']}
              href$={getLinkToExplore({ type: item.tags['type'], group: {} })}
              onClick={onMovingFromInitPage}
            />
          </div>
        );
      }
    }
  ].concat([
    {
      id: 'count',
      width: '8rem',
      label: t('in-infrastructure:explore.count'),
      getContent(item) {
        return (
          <>
            <span>{item.count}</span>
          </>
        );
      }
    }
  ]);

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;

  return (
    <>
      <Header
        totalRepresentedItemCount={totalHits}
        totalRetainedItemCount={totalHits}
        totalHits={totalHits}
        hasErrors={hasErrors}
        isLoading={isLoading}
      />

      <CursorPaginatedTable
        columnDefinitions={columnDefinitions}
        numSkeletonRows={numSkeletonRows}
        totalHits={5}
        onChange={({ orderBy, orderDirection }) => setOrder({ by: orderBy, direction: orderDirection })}
        loadMore={() => {
          cursorPaginationDefaultLoadMore();
          tracking?.onLoadMore?.(pagesLoaded(cursor?.offset, retrievalSize));
        }}
        progress={progress}
        {...tableProps}
        items={items}
        fixedLayout
        orderBy={order.by}
        orderDirection={order.direction}
      />
    </>
  );
}

function getTableData({ timeConfig, backendQueryModel, order, retrievalSize, cursor }) {
  return createGetGroupsSubscription({
    filter: {
      tagFilterExpression: backendQueryModel,
      timeConfig
    },
    pagination: {
      retrievalSize,
      cursor
    },
    groupBy: ['type'],
    type: undefined,
    order
  });
}
