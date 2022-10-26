/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { getGroupTagValue } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import { getLinkToExplore } from 'in-infrastructure/navigation/paths';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { t } from 'in-i18n';

export default function EntityList({ retrievalSize = 20, backendQueryModel, timeConfig, order, type }) {
  const { items, errors, progress, totalHits } = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, retrievalSize, backendQueryModel, order, type, cursor }),
    [timeConfig, retrievalSize, backendQueryModel, type, order]
  );

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;

  const [data, setResultData] = useState(createResultData(items));
  const [orderDir, setOrderDirection] = useState('ASC');
  const [orderByCol, setOrderByColumn] = useState('label');

  const onChangeItems = items => {
    setResultData(createResultData(items));
  };

  if (!isLoading && (data.progress === undefined || data.progress?.loading === true)) {
    onChangeItems(items);
  }

  function createResultData(items) {
    return {
      progress: {
        loading: isLoading
      },
      errors: errors,
      data: {
        items: items ?? [],
        page: 1
      }
    };
  }

  const columnDefinitions = [
    {
      id: 'label',
      width: '8rem',
      label: t('in-infrastructure:explore.name'),
      sortable: true,
      getContent(item) {
        const value = getGroupTagValue(item, 'type');
        return (
          <div>
            <EntityLink
              label={value}
              plugin={item.tags['type']}
              href$={getLinkToExplore({ type: item.tags['type'], group: {} })}
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
      sortable: true,
      getContent(item) {
        return (
          <>
            <span>{item.count}</span>
          </>
        );
      }
    }
  ]);

  return (
    <>
      <ServerTablePresenter
        orderBy={orderByCol}
        orderDirection={orderDir}
        result={data}
        columnDefinitions={columnDefinitions}
        onChange={({ query, orderBy, orderDirection }) => {
          if (query !== undefined) {
            //search
            onChangeItems(items.filter(item => item.tags.type.toLowerCase().includes(query?.toLowerCase())));
          } else {
            //sort
            const sortedItems = sortItems(items, orderBy, orderDirection);

            setOrderByColumn(orderBy);
            setOrderDirection(orderDirection);
            setResultData(sortedItems);
          }
        }}
        searchPlaceholder={t('in-infrastructure:explore.search')}
        leftHeader={
          <Header
            totalRetainedItemCount={totalHits}
            hasErrors={hasErrors}
            isLoading={isLoading}
            dataSource="entityType"
          />
        }
      />
    </>
  );
}

function sortItems(items, orderBy, orderDirection) {
  if (orderBy === 'label') {
    return items.sort((a, b) => {
      if (a.tags.type < b.tags.type) {
        return orderDirection === 'DESC' ? 1 : -1;
      }
      if (a.tags.type > b.tags.type) {
        return orderDirection === 'DESC' ? -1 : 1;
      }
      return 0;
    });
  }
  if (orderBy === 'count') {
    return items.sort((a, b) => {
      if (a.count < b.count) {
        return orderDirection === 'DESC' ? 1 : -1;
      }
      if (a.count > b.count) {
        return orderDirection === 'DESC' ? -1 : 1;
      }
      return 0;
    });
  }
}

function getTableData(params) {
  return getGroupsSubscribeEvent(params);
}

function getGroupsSubscribeEvent({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  backendQueryModel = {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: []
  }
}) {
  return createGetGroupsSubscription({
    pagination: {
      page,
      pageSize,
      retrievalSize: 200
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      tagFilterExpression: backendQueryModel,
      label: query,
      timeConfig
    },
    groupBy: ['type']
  });
}
