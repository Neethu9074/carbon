/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, IconButton, Spacer, Stack, Typography } from '@instana/components';
import { Event, Result, VolatileId } from '@instana/types';

import {
  aiEngineColumn,
  descriptionColumn,
  nameColumn,
  scoreColumn
} from 'in-automation/ActionTable/columnDefinitions';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import GenerateAIActionDialog from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import CreatePolicyDialog from 'in-automation/AutomationCard/CreatePolicyDialog/CreatePolicyDialog';
import useNavigateToActionDetails from 'in-automation/navigation/hooks/useNavigateToActionDetails';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { AiEngineFilter, TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { automationActionAiGenerationUnitEnabled } from 'in-services/featureFlags';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { getTriggerTypeFromEvent } from 'in-automation/AutomationCard/shared';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import useHasAccessToManual from 'in-automation/hooks/useHasAccessToManual';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ScoredAction, TriggerSpecification } from 'in-automation/types';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { TagsFilter } from 'in-automation/components/tableFilters';
import { useSegmentTracker } from 'in-automation/tracker';
import { ACTION_TYPE } from 'in-automation/constants';
import { isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { hasError } from 'in-services/util/result';
import { mapData } from 'in-services/util/result';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const pathSegment = '/recommendedActions';
const matrixPrefix = '';

interface RecommendedActionsTableProps extends ServerTablePresenterProps<ScoredAction> {
  volatileId: VolatileId;
  event: Event;
  trigger: Result<TriggerSpecification>;
}

const actionColumn: ColumnDefinition<ScoredAction, RecommendedActionsTableProps> = {
  id: 'action',
  label: '',
  sortable: false,
  width: 17,
  getContent(action, { volatileId, event, trigger }) {
    if (!role?.canRunAutomationActions && !role?.canConfigureAutomationPolicies) return null;
    return (
      <HorizontalFlexWrapper>
        {action.type !== ACTION_TYPE.DOC_LINK && role?.canRunAutomationActions && (
          <Button
            kind="action"
            icon={action.type === ACTION_TYPE.MANUAL ? 'lib_views_show' : 'lib_actions_play'}
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              addActiveDialog(<RunActionDialog action={action} volatileId={volatileId} event={event} />);
            }}
            noAutoMargin
          >
            {action.type === ACTION_TYPE.MANUAL
              ? t('in-automation:ActionCatalog.view')
              : t('in-automation:ActionCatalog.run')}
          </Button>
        )}
        {role?.canConfigureAutomationPolicies && (
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
        )}
      </HorizontalFlexWrapper>
    );
  }
};

const columnDefinitions: ColumnDefinition<ScoredAction, RecommendedActionsTableProps>[] = [
  nameColumn as ColumnDefinition<ScoredAction, RecommendedActionsTableProps>,
  descriptionColumn as ColumnDefinition<ScoredAction, RecommendedActionsTableProps>,
  tagsColumn as ColumnDefinition<ScoredAction, RecommendedActionsTableProps>,
  aiEngineColumn,
  scoreColumn,
  actionColumn
];
function GenerateAIActionButton({
  event,
  trigger,
  ootbRecommendedActions
}: {
  event: Event;
  trigger: Result<TriggerSpecification>;
  ootbRecommendedActions: Result<ScoredAction[]>;
}) {
  const { generateAIButtonClickTrackerSegment } = useSegmentTracker();
  const name = hasError(trigger) ? event?.problem?.problemText ?? '' : trigger.data!?.name;
  const hasAccessToManual = useHasAccessToManual();

  if (!role?.canConfigureAutomationActions || !hasAccessToManual) return null;
  return (
    <Button
      kind="action"
      onClick={() => {
        generateAIButtonClickTrackerSegment({
          eventName: name,
          type: 'manual'
        });
        addActiveDialog(
          <GenerateAIActionDialog event={event} trigger={trigger} ootbRecommendedActions={ootbRecommendedActions} />
        );
      }}
      icon="lib_launch_ai"
    >
      {t('in-automation:generateWithWatsonx')}
    </Button>
  );
}

function useFilters({
  setServerTableUrlState,
  recommendedActions
}: {
  recommendedActions: Result<ScoredAction[]>;
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
    filteredActions: mapData(recommendedActions, data =>
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

interface RecommendedActionsProps {
  volatileId: VolatileId;
  event: Event;
  recommendedActions: Result<ScoredAction[]>;
  trigger: Result<TriggerSpecification>;
  ootbRecommendedActions: Result<ScoredAction[]>;
}

export default function RecommendedActions({
  volatileId,
  event,
  recommendedActions,
  trigger,
  ootbRecommendedActions
}: RecommendedActionsProps) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'score',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;
  const navigateToActionDetails = useNavigateToActionDetails();
  const availableAiEngines = [...new Set(recommendedActions.data?.map(({ aiEngine }) => aiEngine))];
  const availableTags = [...new Set(recommendedActions.data?.flatMap(({ tags }) => tags ?? []))];

  const { filteredActions, types, setTypes, aiEngine, setAiEngine, tags, setTags } = useFilters({
    recommendedActions,
    setServerTableUrlState
  });

  const result = usePaginatedScoredActions({
    actions: filteredActions,
    serverTableUrlState,
    setServerTableUrlState
  });

  const totalHits = result?.data?.totalHits;

  const handleRowClick = (action: ScoredAction) => {
    navigateToActionDetails(action.id, false);
  };
  const showOotbActions =
    getTriggerTypeFromEvent(event) === 'builtinEvent' && (ootbRecommendedActions.data?.length ?? 0) > 0;

  return (
    <ServerTablePresenter<ScoredAction, RecommendedActionsTableProps>
      columnDefinitions={columnDefinitions}
      volatileId={volatileId}
      event={event}
      trigger={trigger}
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
      searchMaxWidth={180}
      page={page}
      pageSize={pageSize}
      query={query}
      result={result}
      rightHeader={
        <Stack direction="horizontal">
          {(showOotbActions || automationActionAiGenerationUnitEnabled) && !isLoading(trigger) && (
            <GenerateAIActionButton event={event} trigger={trigger} ootbRecommendedActions={ootbRecommendedActions} />
          )}
          <TypeFilter type={types} setType={params => setTypes({ types: params.types })} />
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
