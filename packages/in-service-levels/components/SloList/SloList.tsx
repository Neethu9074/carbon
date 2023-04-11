/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { t } from '@instana/i18n-react';

import SloBlueprintColumnContent from 'in-service-levels/components/SloList/components/SloBlueprintColumnContent';
import SloEntityColumnContent from 'in-service-levels/components/SloList/components/SloEntityColumnContent';
import SloNameColumnContent from 'in-service-levels/components/SloList/components/SloNameColumnContent';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import SloListFilters from 'in-service-levels/components/SloList/components/SloListFilters';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import useSloListFilterUrlState from 'in-service-levels/hooks/useSloListFilterUrlState';
import SloActions from 'in-service-levels/components/SloList/components/SloActions';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import useSloListItems from 'in-service-levels/hooks/useSloListItems';
import useSloTags from 'in-service-levels/hooks/useSloTags';
import { LabeledEntity } from 'in-service-levels/types';
import { all } from 'in-hooks/utils/progress';

export interface SloListItem {
  configuration: ServiceLevelObjectiveConfiguration;
  status: number;
  entity: LabeledEntity;
}

interface Props {
  pathSegment: string;
  matrixPrefix?: string;
}

const columnDefinitions: ColumnDefinition<SloListItem>[] = [
  {
    id: 'name',
    label: t('in-service-levels:sloList.columnLabels.name'),
    getContent: item => <SloNameColumnContent item={item} />
  },
  {
    id: 'entity',
    label: t('in-service-levels:sloList.columnLabels.entity'),
    getContent: item => <SloEntityColumnContent item={item} />
  },
  {
    id: 'blueprint',
    label: t('in-service-levels:sloList.columnLabels.blueprint'),
    getContent: item => <SloBlueprintColumnContent item={item} />
  },
  {
    id: 'actions',
    label: '',
    getContent: () => <SloActions />,
    useMinimumAmountOfHorizontalSpace: true
  }
];

export default function SloList({ pathSegment, matrixPrefix = '' }: Props) {
  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'name',
    defaultPageSize: 10
  });
  const [{ tags, entityType }, setFilter] = useSloListFilterUrlState({ pathSegment, matrixPrefix });

  const [result, , sloErrors, sloProgress] = useSloListItems({
    page,
    pageSize,
    orderBy,
    orderDirection,
    query,
    tags,
    entityType
  });
  const [availableTags, , tagsErrors, tagsProgress] = useSloTags();

  const actualPage = result?.page ?? page;
  const actualPageSize = result?.pageSize ?? pageSize;
  const progress = all(sloProgress, tagsProgress);
  const errors = [...sloErrors, ...tagsErrors];

  return (
    <ServerTablePresenter
      cardTitle={t('in-service-levels:sloList.title')}
      page={actualPage}
      pageSize={actualPageSize}
      orderBy={orderBy}
      orderDirection={orderDirection}
      query={query}
      columnDefinitions={columnDefinitions}
      result={{
        progress,
        errors,
        data: result
      }}
      onChange={setServerTableState}
      rightHeader={() => (
        <SloListFilters
          tags={availableTags ?? []}
          selectedTags={tags}
          entityType={entityType}
          setFilter={setFilter}
          disabled={progress.loading}
          withTrailingGap
        />
      )}
      tableInCard
    />
  );
}
