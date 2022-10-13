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

  const onChangeItems = items => {
    setResultData(createResultData(items));
  };

  if (!isLoading && data.progress.loading === true) {
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
      sortable: false,
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
        orderBy="label"
        orderDirection="ASC"
        result={data}
        columnDefinitions={columnDefinitions}
        onChange={({ query }) => {
          onChangeItems(items.filter(item => item.tags.type.toLowerCase().includes(query?.toLowerCase())));
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
