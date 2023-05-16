/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { t } from '@instana/i18n-react';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import SloErrorBudgetColumnContent from 'in-service-levels/components/SloList/components/SloErrorBudgetColumnContent';
import SloBlueprintColumnContent from 'in-service-levels/components/SloList/components/SloBlueprintColumnContent';
import SloEntityColumnContent from 'in-service-levels/components/SloList/components/SloEntityColumnContent';
import SloStatusColumnContent from 'in-service-levels/components/SloList/components/SloStatusColumnContent';
import SloNameColumnContent from 'in-service-levels/components/SloList/components/SloNameColumnContent';
import SloTagsColumnContent from 'in-service-levels/components/SloList/components/SloTagsColumnContent';
import useNavigateToSloDashboard from 'in-service-levels/navigation/hooks/useNavigateToSloDashboard';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import SloListFilters from 'in-service-levels/components/SloList/components/SloListFilters';
import useSloListFilterUrlState from 'in-service-levels/hooks/useSloListFilterUrlState';
import SloActions from 'in-service-levels/components/SloList/components/SloActions';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import useSloListItems from 'in-service-levels/hooks/useSloListItems';
import { MetricDataSeries } from 'in-components/Chart/types';
import useSloTags from 'in-service-levels/hooks/useSloTags';
import { LabeledEntity } from 'in-service-levels/types';
import { all } from 'in-hooks/utils/progress';

export interface SloListItem {
  configuration: ServiceLevelObjectiveConfiguration;
  entity: LabeledEntity;
  status: number;
  remainingBudget: number;
  burnDown: MetricDataSeries;
  metricTimeConfig: TimeConfig;
  metricGranularity: number;
}

interface Props {
  pathSegment: string;
  matrixPrefix?: string;
}

const columnDefinitions: ColumnDefinition<SloListItem>[] = [
  {
    id: 'name',
    label: t('in-service-levels:sloList.columnLabels.name'),
    getContent: item => <SloNameColumnContent item={item} />,
    width: 25
  },
  {
    id: 'entity',
    label: t('in-service-levels:sloList.columnLabels.entity'),
    getContent: item => <SloEntityColumnContent item={item} />,
    width: 20
  },
  {
    id: 'blueprint',
    label: t('in-service-levels:sloList.columnLabels.blueprint'),
    getContent: item => <SloBlueprintColumnContent item={item} />,
    width: 5
  },
  {
    id: 'errorBudget',
    label: t('in-service-levels:sloList.columnLabels.errorBudget'),
    getContent: item => <SloErrorBudgetColumnContent item={item} />,
    width: 22.5
  },
  {
    id: 'status',
    label: t('in-service-levels:sloList.columnLabels.status'),
    getContent: item => <SloStatusColumnContent item={item} />,
    width: 10
  },
  {
    id: 'tags',
    label: t('in-service-levels:sloList.columnLabels.tags'),
    getContent: item => <SloTagsColumnContent item={item} />,
    width: 15
  },
  {
    id: 'actions',
    label: '',
    getContent: () => <SloActions />,
    width: 2.5
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
  const navigateToSloDashboard = useNavigateToSloDashboard();

  const actualPage = result?.page ?? page;
  const actualPageSize = result?.pageSize ?? pageSize;
  const progress = all(sloProgress, tagsProgress);
  const errors = [...sloErrors, ...tagsErrors];

  return (
    <ServerTablePresenter<SloListItem, ServerTablePresenterProps<SloListItem>>
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
      onRowClick={({ configuration }) => navigateToSloDashboard(configuration)}
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
      fixedLayout
    />
  );
}
