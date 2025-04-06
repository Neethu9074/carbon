/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import SloErrorBudgetColumnContent from 'in-service-levels/components/SloList/components/SloErrorBudgetColumnContent';
import SloBlueprintColumnContent from 'in-service-levels/components/SloList/components/SloBlueprintColumnContent';
import { createEntityIdUrlParameter, createTagsUrlParameter } from 'in-service-levels/navigation/urlParameters';
import SloEntityColumnContent from 'in-service-levels/components/SloList/components/SloEntityColumnContent';
import SloStatusColumnContent from 'in-service-levels/components/SloList/components/SloStatusColumnContent';
import SloNameColumnContent from 'in-service-levels/components/SloList/components/SloNameColumnContent';
import SloTagsColumnContent from 'in-service-levels/components/SloList/components/SloTagsColumnContent';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import SloListFilters from 'in-service-levels/components/SloList/components/SloListFilters';
import useSloListFilterUrlState from 'in-service-levels/hooks/useSloListFilterUrlState';
import SloActions from 'in-service-levels/components/SloList/components/SloActions';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import useSloListItems from 'in-service-levels/hooks/useSloListItems';
import { MetricDataSeries } from 'in-components/Chart/types';
import useSloTags from 'in-service-levels/hooks/useSloTags';
import { LabeledEntity } from 'in-service-levels/types';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { all } from 'in-hooks/utils/progress';
import { t } from 'in-i18n';

interface GetColumnDefinitionsProps {
  isMediumWidth?: boolean;
  isSmallWidth?: boolean;
  showEntityInfo?: boolean;
}

function getColumnDefinitions({
  isMediumWidth,
  isSmallWidth,
  showEntityInfo
}: GetColumnDefinitionsProps): ColumnDefinition<SloListItem>[] {
  const columnDefinitions: ColumnDefinition<SloListItem>[] = [
    {
      id: 'name',
      label: t('in-service-levels:sloList.columnLabels.name'),
      getContent: item => <SloNameColumnContent item={item} />,
      width: 23,
      sortable: true
    },
    {
      id: 'entityType',
      label: t('in-service-levels:sloList.columnLabels.entity'),
      getContent: item => <SloEntityColumnContent item={item} />,
      width: 18.5,
      sortable: false
    },
    {
      id: 'blueprint',
      label: t('in-service-levels:sloList.columnLabels.blueprint'),
      getContent: item => <SloBlueprintColumnContent item={item} />,
      width: 8,
      sortable: false
    },
    {
      id: 'errorBudget',
      label: t('in-service-levels:sloList.columnLabels.errorBudget'),
      getContent: item => <SloErrorBudgetColumnContent item={item} showSparkChart={isMediumWidth} />,
      width: 18.5,
      sortable: false
    },
    {
      id: 'status',
      label: t('in-service-levels:sloList.columnLabels.status'),
      getContent: item => <SloStatusColumnContent item={item} />,
      width: 12,
      sortable: false
    },
    {
      id: 'tags',
      label: t('in-service-levels:sloList.columnLabels.tags'),
      getContent: item => <SloTagsColumnContent item={item} />,
      width: 15,
      sortable: false
    },
    {
      id: 'actions',
      label: '',
      getContent: item => <SloActions item={item} />,
      width: 5,
      sortable: false
    }
  ];

  return columnDefinitions.filter(({ id }) => {
    // Hide blueprint column if showBluerprintCol is false
    return (id !== 'blueprint' || isSmallWidth) && (id !== 'entityType' || (showEntityInfo ?? true));
  });
}

export interface SloListItem {
  configuration: ServiceLevelObjectiveConfiguration;
  entities: LabeledEntity[];
  status?: number;
  remainingBudget?: number;
  burnDown: MetricDataSeries;
  metricTimeConfig: TimeConfig;
  metricGranularity: number;
}

interface SloListProps {
  pathSegment: string;
  matrixPrefix?: string;
  entityIds?: string;
  isDashboard?: boolean;
  showEntityInfo?: boolean;
}

export default function SloList({
  pathSegment,
  matrixPrefix = '',
  entityIds,
  isDashboard,
  showEntityInfo
}: SloListProps) {
  const isMediumWidth = useMediaQuery('(min-width: 1560px)');
  const isSmallWidth = useMediaQuery('(min-width: 1200px)');

  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'name',
    defaultPageSize: 10,
    paginationResettingUrlParameters: [
      createEntityIdUrlParameter(pathSegment, matrixPrefix),
      createTagsUrlParameter(pathSegment, matrixPrefix)
    ]
  });
  const [{ tags, entityType }, setFilter] = useSloListFilterUrlState({ pathSegment, matrixPrefix });

  const [result, , , sloProgress] = useSloListItems({
    page,
    pageSize,
    orderBy,
    orderDirection,
    query,
    tags,
    entityIds,
    entityType
  });
  const [availableTags, , , tagsProgress] = useSloTags();

  const actualPage = result?.page ?? page;
  const actualPageSize = result?.pageSize ?? pageSize;
  const progress = all(sloProgress, tagsProgress);

  return (
    <ServerTablePresenter<SloListItem, ServerTablePresenterProps<SloListItem>>
      cardTitle={t('in-service-levels:sloList.title')}
      page={actualPage}
      pageSize={actualPageSize}
      orderBy={orderBy}
      orderDirection={orderDirection}
      query={query}
      columnDefinitions={getColumnDefinitions({ isMediumWidth, isSmallWidth, showEntityInfo })}
      result={{
        progress,
        errors: [],
        data: result
      }}
      onChange={setServerTableState}
      rightHeader={() =>
        !isDashboard ? (
          <SloListFilters
            tags={availableTags ?? []}
            selectedTags={tags}
            entityType={entityType}
            setFilter={setFilter}
          />
        ) : null
      }
      tableInCard={!isDashboard}
      fixedLayout
    />
  );
}
