/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Result, InfrastructureGroup, CursorPaginatedResult, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { useLinkToExplore as useLinkToCustomEntityExplore } from 'in-infrastructure/navigation/paths';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import CsvExporter from 'in-components/CsvExporter/CsvExporter';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface CustomEntityGroup {
  tags: {
    'customentity.model.name': string;
  };
  count: number;
  metrics: Record<string, any>;
}

export default function CustomEntitiesList() {
  const timeConfig = useTimeConfig();
  const getLinkToCustomEntityExplore = useLinkToCustomEntityExplore();

  const entityResults =
    useObservable(() => getCustomEntitiesSubscription(timeConfig), [timeConfig]) ??
    (pendingResult as Result<CursorPaginatedResult<InfrastructureGroup>>);

  if (isLoading(entityResults)) return null;

  const columnDefinitions = [
    {
      id: 'label',
      width: '8rem',
      label: t('in-infrastructure:explore.name'),
      sortable: true,
      getContent: (item: CustomEntityGroup) => {
        const customEntityModel = item.tags?.['customentity.model.name'] || '';
        return (
          <div>
            <EntityLink label={customEntityModel} href={getLinkToCustomEntityExplore({ customEntityModel })} />
          </div>
        );
      }
    },
    {
      id: 'count',
      width: '8rem',
      label: t('in-infrastructure:explore.count'),
      sortable: true,
      getContent: (item: CustomEntityGroup) => {
        return (
          <div>
            <span>{item.count}</span>
          </div>
        );
      }
    }
  ];

  const headers = ['name', 'count'];

  function getCsvItems() {
    return (
      entityResults?.data?.items?.map(item => ({
        name: item.tags?.['customentity.model.name'] || '',
        count: item.count
      })) || []
    );
  }

  return (
    <ServerTablePresenter<CustomEntityGroup, ServerTablePresenterProps<CustomEntityGroup>>
      columnDefinitions={columnDefinitions}
      cardTitle={`Custom Entities (${entityResults?.data?.items.length})`}
      rightHeader={<CsvExporter headers={headers} data={getCsvItems()} fileName="custom_entity_types.csv" />}
      searchPlaceholder={t('in-infrastructure:explore.search')}
      withoutSearchIcon
      page={0}
      pageSize={0}
      orderBy={''}
      orderDirection={'ASC'}
      result={{
        progress: {
          loading: false
        },
        errors: [],
        data: {
          items: entityResults?.data?.items as CustomEntityGroup[],
          page: 0,
          pageSize: 0,
          totalHits: 0
        }
      }}
    />
  );
}

function getCustomEntitiesSubscription(timeConfig: TimeConfig) {
  return createGetGroupsSubscription({
    filter: {
      timeConfig,
      tagFilterExpression: {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: []
      }
    },
    pagination: {
      retrievalSize: 100
    },
    type: 'customEntity',
    groupBy: ['customentity.model.name'],
    firstPageOnly: false
  });
}
