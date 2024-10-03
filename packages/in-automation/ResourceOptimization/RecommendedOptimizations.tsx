/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import {
  actionCategoryColumn,
  nameColumn,
  impactedServicesColumn
} from 'in-automation/ResourceOptimization/columnDefinitions';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { usePaginatedResourceOptimizations } from 'in-automation/AutomationCard/useScoredActions';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { RecommendedAction, Result } from 'in-types';
import { t } from 'in-i18n';

const pathSegment = '/RecommendedOptimizations';
const matrixPrefix = '';

const columnDefinitions: ColumnDefinition<RecommendedAction, RecommendedOptimizationsTableProps>[] = [
  nameColumn,
  impactedServicesColumn,
  actionCategoryColumn
];
/*
function useFilters({
  setServerTableUrlState,
  recommendedOptimizations
}: {
  recommendedOptimizations: Result<ScoredAction[]>;
  setServerTableUrlState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [types, setTypesState] = useState<string[] | undefined>(undefined);
  const [aiEngine, setAiEngine] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const filters = [
    {
      key: 'types' as const,
      value: types
    },
    {
      key: 'aiEngine' as const,
      value: aiEngine
    },
    {
      key: 'tags' as const,
      value: tags
    }
  ];

  return {
    filteredActions: mapData(recommendedOptimizations, data =>
      data?.filter(action =>
        filters.reduce((shouldInclude, filter) => {
          const emptyFilter = !filter.value?.length;
          if (emptyFilter) return shouldInclude;
          switch (filter.key) {
            case 'types':
              return shouldInclude && (filter.value?.some(type => action.type === type) ?? false);
            case 'aiEngine':
              return (shouldInclude = shouldInclude && filter.value === action.aiEngine);
            case 'tags':
              return shouldInclude && (action.tags?.some(tag => filter.value?.includes(tag)) ?? false);
          }
        }, true)
      )
    ),
    types,
    setTypes: ({ types }: { types: string[] | undefined }) => {
      setTypesState(types);
      setServerTableUrlState({ page: 1, query: '' });
    },
    aiEngine,
    setAiEngine: (aiEngine: string | null) => {
      setAiEngine(aiEngine);
      setServerTableUrlState({ page: 1, query: '' });
    },
    tags,
    setTags: (tags: string[]) => {
      setTags(tags);
      setServerTableUrlState({ page: 1, query: '' });
    }
  };
}*/

interface RecommendedOptimizationsTableProps extends ServerTablePresenterProps<RecommendedAction> {}

interface RecommendedOptimizationsProps {
  recommendedActions: Result<RecommendedAction[]>;
  totalRecommendedActions: number | undefined;
}

export default function RecommendedOptimizations({
  recommendedActions,
  totalRecommendedActions
}: RecommendedOptimizationsProps) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'score',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection } = serverTableUrlState;

  const result = usePaginatedResourceOptimizations({
    recommendedActions,
    serverTableUrlState,
    setServerTableUrlState
  });

  //TODO update with modal code
  const handleRowClick = () => {};

  const totalHits = totalRecommendedActions ?? 0;

  return (
    <ServerTablePresenter<RecommendedAction, RecommendedOptimizationsTableProps>
      columnDefinitions={columnDefinitions}
      fixedLayout
      leftHeader={
        <Typography variant="heading-300">
          {result?.progress?.loading
            ? t('in-automation:recommendedOptimizations')
            : t('in-automation:recommendedOptimizationsWithCount', { count: totalHits })}
        </Typography>
      }
      cardTitle={
        result?.progress?.loading
          ? t('in-automation:recommendedOptimizations')
          : t('in-automation:recommendedOptimizationsWithCount', { count: totalHits })
      }
      onChange={setServerTableUrlState}
      orderBy={orderBy}
      orderDirection={orderDirection}
      searchMaxWidth={180}
      page={page}
      pageSize={pageSize}
      result={result}
      rightHeader={null}
      searchPlaceholder={t('in-automation:searchOptimizations')}
      onRowClick={handleRowClick}
      tableInCard={false}
    />
  );
}
