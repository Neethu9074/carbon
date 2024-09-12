/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, IconButton, Spacer, Stack, Typography } from '@instana/components';

import {
  aiEngineColumn,
  descriptionColumn,
  nameColumn,
  scoreColumn
} from 'in-automation/ActionTable/columnDefinitions';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import CreatePolicyDialog from 'in-automation/AutomationCard/CreatePolicyDialog/CreatePolicyDialog';
import useNavigateToActionDetails from 'in-automation/navigation/hooks/useNavigateToActionDetails';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { AiEngineFilter, TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { TriggerSpecification } from 'in-automation/Policies/types';
import { TagsFilter } from 'in-automation/components/tableFilters';
import { isExternal } from 'in-automation/ActionCatalog/shared';
import { Event, Result, VolatileId } from 'in-types';
import Tooltip from 'in-components/Tooltip/Tooltip';
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

const actionColumn: ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps> = {
  id: 'action',
  label: '',
  sortable: false,
  width: 8,
  getContent(action, { volatileId, event, trigger }) {
    const isManualExternal =
      action?.metadata?.ai && action?.metadata?.ai[0]?.turbonomicActionMode === 'MANUAL' && isExternal(action.type);
    if (isManualExternal) {
      if (!role?.canRunAutomationActions) return null;
      return (
        <Button
          kind="action"
          icon="lib_actions_play"
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            addActiveDialog(<RunActionDialog action={action} volatileId={volatileId} event={event} />);
          }}
          noAutoMargin
        >
          {t('in-automation:ActionCatalog.run')}
        </Button>
      );
    }
    if (!role?.canConfigureAutomationPolicies || isExternal(action.type)) return null;
    return (
      <Tooltip content={t('in-automation:createPolicyWithName', { actionName: action.name })} delay={500}>
        <IconButton
          kind="primaryv2"
          type="lib_openclose_add_circle_outline"
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            addActiveDialog(<CreatePolicyDialog trigger={trigger} action={action} event={event} />);
          }}
        />
      </Tooltip>
    );
  }
};

const columnDefinitions: ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>[] = [
  nameColumn as ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>,
  descriptionColumn as ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>,
  tagsColumn as ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>,
  aiEngineColumn,
  scoreColumn,
  actionColumn
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
  const availableAiEngines = [...new Set(recommendedOptimizations.data?.map(({ aiEngine }) => aiEngine))];
  const availableTags = [...new Set(recommendedOptimizations.data?.flatMap(({ tags }) => tags ?? []))];

  const { filteredActions, types, setTypes, aiEngine, setAiEngine, tags, setTags } = useFilters({
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
          <AiEngineFilter availableAiEngines={availableAiEngines} aiEngine={aiEngine} setAiEngine={setAiEngine} />
          <TagsFilter availableTags={availableTags} tags={tags} setTags={setTags} />
          <Spacer horizontal="small" />
        </Stack>
      }
      searchPlaceholder={t('in-automation:searchActions')}
      onRowClick={!role?.canConfigureAutomationPolicies ? handleRowClick : undefined}
    />
  );
}
