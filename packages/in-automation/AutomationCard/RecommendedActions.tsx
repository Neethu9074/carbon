/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, Spacer, Stack, Typography } from '@instana/components';

import {
  nameColumn,
  aiEngineColumn,
  scoreColumn,
  descriptionColumn
} from 'in-automation/ActionTable/columnDefinitions';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { AiEngineFilter, TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { SetActiveKey } from 'in-automation/AutomationCard/AutomationCard';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { TagsFilter } from 'in-automation/components/tableFilters';
import { isExternal } from 'in-automation/ActionCatalog/shared';
import { VolatileId, Event, Result } from 'in-types';
import { mapData } from 'in-services/util/result';
import { ScoredAction } from 'in-automation/api';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const pathSegment = '/recommendedActions';
const matrixPrefix = '';

const getActionColumn = (
  volatileId: VolatileId,
  event: Event,
  setActiveKey: SetActiveKey
): ColumnDefinition<ScoredAction> => ({
  id: 'action',
  label: '',
  sortable: false,
  width: 8,
  getContent(action) {
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
      <Button
        kind="action"
        icon="lib_views_show"
        onClick={e => {
          stopPropagationAndPreventDefault(e);
          addActiveDialog(
            <RunActionDialog
              action={action}
              volatileId={volatileId}
              event={event}
              setActiveKey={setActiveKey}
              viewRecommendedAction
            />
          );
        }}
        noAutoMargin
      >
        {t('in-automation:ActionCatalog.view')}
      </Button>
    );
  }
});

const columnDefinitions: ColumnDefinition<ScoredAction>[] = [
  nameColumn,
  descriptionColumn,
  tagsColumn as ColumnDefinition<ScoredAction>,
  aiEngineColumn,
  scoreColumn
];

interface RecommendedActionsProps {
  volatileId: VolatileId;
  event: Event;
  recommendedActions: Result<ScoredAction[]>;
  setActiveKey: SetActiveKey;
}

export default function RecommendedActions({
  volatileId,
  event,
  setActiveKey,
  recommendedActions
}: RecommendedActionsProps) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'score',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const availableAiEngines = [...new Set(recommendedActions.data?.map(({ aiEngine }) => aiEngine))];
  const availableTags = [...new Set(recommendedActions.data?.flatMap(({ tags }) => tags ?? []))];

  const { filteredActions, type, setType, aiEngine, setAiEngine, tags, setTags } = useFilters({
    recommendedActions,
    setServerTableUrlState
  });

  const result = usePaginatedScoredActions({
    actions: filteredActions,
    serverTableUrlState,
    setServerTableUrlState
  });

  const totalHits = result?.data?.totalHits;

  return (
    <ServerTablePresenter<ScoredAction, ServerTablePresenterProps<ScoredAction>>
      columnDefinitions={[...columnDefinitions, getActionColumn(volatileId, event, setActiveKey)]}
      fixedLayout
      leftHeader={
        <Typography variant="heading-300">
          {result?.progress.loading
            ? t('in-automation:recommendedActions')
            : t('in-automation:recommendedActionsWithCount', { count: totalHits })}
        </Typography>
      }
      onChange={setServerTableUrlState}
      orderBy={orderBy}
      orderDirection={orderDirection}
      page={page}
      pageSize={pageSize}
      query={query}
      result={result}
      rightHeader={
        <>
          <Stack direction="horizontal">
            <TypeFilter type={type} setType={setType} showExternal />
            <AiEngineFilter availableAiEngines={availableAiEngines} aiEngine={aiEngine} setAiEngine={setAiEngine} />
            <TagsFilter availableTags={availableTags} tags={tags} setTags={setTags} />
          </Stack>
          <Spacer horizontal="small" />
        </>
      }
      searchPlaceholder={t('in-automation:searchActions')}
    />
  );
}

function useFilters({
  setServerTableUrlState,
  recommendedActions
}: {
  recommendedActions: Result<ScoredAction[]>;
  setServerTableUrlState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [type, setType] = useState<string | null>(null);
  const [aiEngine, setAiEngine] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const filters = [
    {
      key: 'type' as const,
      value: type
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
    filteredActions: mapData(recommendedActions, data =>
      data.filter(action =>
        filters.reduce((shouldInclude, filter) => {
          const emptyFilter = !filter.value?.length;
          if (emptyFilter) return shouldInclude;
          switch (filter.key) {
            case 'type':
              return (shouldInclude = shouldInclude && filter.value === action.type);
            case 'aiEngine':
              return (shouldInclude = shouldInclude && filter.value === action.aiEngine);
            case 'tags':
              return shouldInclude && (action.tags?.some(tag => filter.value?.includes(tag)) ?? false);
          }
        }, true)
      )
    ),
    type,
    setType: (type: string | null) => {
      setType(type);
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
