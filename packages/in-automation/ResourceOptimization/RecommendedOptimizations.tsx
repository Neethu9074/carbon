/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Spacer, Stack, Typography } from '@instana/components';

import {
  actionCategoryColumn,
  nameColumn,
  typesColumn,
  impactedServicesColumn
} from 'in-automation/ResourceOptimization/columnDefinitions';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import useNavigateToActionDetails from 'in-automation/navigation/hooks/useNavigateToActionDetails';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { TriggerSpecification } from 'in-automation/Policies/types';
import { isExternal } from 'in-automation/ActionCatalog/shared';
import { Event, Result, VolatileId } from 'in-types';
import { mapData } from 'in-services/util/result';
import { ScoredAction } from 'in-automation/api';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const pathSegment = '/RecommendedOptimizations';
const matrixPrefix = '';

interface RecommendedOptimizationsTableProps extends ServerTablePresenterProps<ScoredAction> {
  volatileId: VolatileId;
  event: Event;
  trigger: Result<TriggerSpecification>;
}

const columnDefinitions: ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>[] = [
  nameColumn as ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>,
  typesColumn,
  impactedServicesColumn,
  actionCategoryColumn as ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>
];

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
      data.filter(action =>
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
}

interface RecommendedOptimizationsProps {
  volatileId: VolatileId;
  event: Event;
  recommendedOptimizations: Result<ScoredAction[]>;
  trigger: Result<TriggerSpecification>;
}

export default function RecommendedOptimizations({
  volatileId,
  event,
  recommendedOptimizations,
  trigger
}: RecommendedOptimizationsProps) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'score',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;
  const navigateToActionDetails = useNavigateToActionDetails();

  const { filteredActions, types, setTypes } = useFilters({
    recommendedOptimizations,
    setServerTableUrlState
  });

  const result = usePaginatedScoredActions({
    actions: filteredActions,
    serverTableUrlState,
    setServerTableUrlState
  });

  const totalHits = result?.data?.totalHits;

  const handleRowClick = (action: ScoredAction) => {
    if (!isExternal(action.type)) {
      navigateToActionDetails(action.id, false);
    }
  };

  return (
    <ServerTablePresenter<ScoredAction, RecommendedOptimizationsTableProps>
      columnDefinitions={columnDefinitions}
      volatileId={volatileId}
      event={event}
      trigger={trigger}
      fixedLayout
      leftHeader={
        <Typography variant="heading-300">
          {result?.progress.loading
            ? t('in-automation:recommendedOptimizations')
            : t('in-automation:recommendedOptimizationsWithCount', { count: totalHits })}
        </Typography>
      }
      onChange={setServerTableUrlState}
      orderBy={orderBy}
      orderDirection={orderDirection}
      searchMaxWidth={180}
      page={page}
      pageSize={pageSize}
      query={query}
      result={result}
      rightHeader={
        <Stack direction="horizontal">
          <TypeFilter type={types} setType={params => setTypes({ types: params.types })} showExternal />
          <Spacer horizontal="small" />
        </Stack>
      }
      searchPlaceholder={t('in-automation:searchOptimizations')}
      onRowClick={!role?.canConfigureAutomationPolicies ? handleRowClick : undefined}
    />
  );
}
