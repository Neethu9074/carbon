/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { getGroupTagValue } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import { ErroneousResult } from 'in-components/QueryBuilder/components/Header/CountHeader';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import { getLinkToExplore } from 'in-infrastructure/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import EntityLink from 'in-components/EntityLink/EntityLink';
import CsvExporter from 'in-components/CsvExporter';
import { t } from 'in-i18n';

export default function EntityList({ retrievalSize = 20, backendQueryModel, timeConfig, order, type, setOrder }) {
  const { items, errors, progress } = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, retrievalSize, backendQueryModel, order, type, cursor }),
    [timeConfig, retrievalSize, backendQueryModel, type, order]
  );

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;

  const [result, setResultData] = useState(createResultData(items));

  const onChangeItems = items => {
    return setResultData(createResultData(items));
  };

  if (isLoading && result.data.items.length > 0 && items.length === 0) {
    onChangeItems([]);
  }

  if (!isLoading && result.progress.loading && items.length > 0 && result.data.items.length === 0) {
    if (order.by === 'count') {
      onChangeItems(sortItems(items, order.by, order.direction));
    } else {
      onChangeItems(items);
    }
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

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Count', key: 'count' }
  ];

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

  function getCsvItems() {
    return result?.data?.items.map(item => ({ name: getGroupTagValue(item, 'type'), count: item.count })) || [];
  }

  return (
    <>
      {hasErrors && <ErroneousResult />}
      <ServerTablePresenter
        orderBy={order.by}
        orderDirection={order.direction}
        result={result}
        columnDefinitions={columnDefinitions}
        cardTitle={t('in-infrastructure:explore.entityTypes', { count: items?.data?.items?.length ?? '' })}
        onChange={({ query, orderBy, orderDirection }) => {
          if (query !== undefined) {
            //search
            onChangeItems(
              items.filter(item =>
                getGroupTagValue(item, 'type')
                  .toLowerCase()
                  .includes(query?.toLowerCase())
              )
            );
          } else {
            //sort
            setOrder({ by: orderBy, direction: orderDirection });
          }
        }}
        rightHeader={<CsvExporter headers={headers} data={getCsvItems()} fileName="entity_types.csv" />}
        searchPlaceholder={t('in-infrastructure:explore.search')}
        withoutSearchIcon
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
  order,
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
      by: order.by,
      direction: order.direction
    },
    filter: {
      tagFilterExpression: backendQueryModel,
      label: query,
      timeConfig
    },
    groupBy: ['type']
  });
}
