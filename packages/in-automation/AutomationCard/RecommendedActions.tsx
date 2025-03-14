/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, IconButton, Spacer, Stack, Typography, Link, SvgIcon } from '@instana/components';
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
import { useTurboAgentSnapShots } from 'in-automation/ResourceOptimization/useResourceOptimization';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import TurboActionRunModal from 'in-automation/ResourceOptimization/TurboActionRunModal';
import { AiEngineFilter, TypeFilter } from 'in-automation/ActionTable/tableFilters';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ScoredAction, TriggerSpecification } from 'in-automation/types';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { isAIAction, isAIActionCopy } from 'in-automation/utils/action';
import { getDocLinkFromFields } from 'in-automation/utils/actionField';
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

import locals from 'in-automation/AutomationCard/RecommendedActions.mless';

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
  getContent: (action, { volatileId, event, trigger }) => (
    <ExecuteButton action={action} volatileId={volatileId} event={event} trigger={trigger} />
  )
};

function ExecuteButton({
  action,
  volatileId,
  event,
  trigger
}: {
  action: ScoredAction;
  volatileId: VolatileId;
  event: Event;
  trigger: Result<TriggerSpecification>;
}) {
  const { runActionTrackerSegment } = useSegmentTracker();
  const { entityId } = event;
  const agentSnapShots = useTurboAgentSnapShots();
  const agents = agentSnapShots?.data?.online ?? [];
  if (!role?.canRunAutomationActions && !role?.canConfigureAutomationPolicies) return null;
  if (action.type === ACTION_TYPE.EXTERNAL) {
    const isManualExternal = action?.metadata?.ai;

    if (!isManualExternal) return null;
    if (isManualExternal) {
      if (!role?.canRunAutomationActions) return null;

      return (
        <Button
          kind="action"
          icon="lib_actions_play"
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            // addActiveDialog(<RunActionDialog action={action} volatileId={volatileId} event={event} />);
            addActiveDialog(
              <TurboActionRunModal action={action} agents={agents} eventId={event?.id} targetSnapshotId={entityId} />
            );
          }}
          noAutoMargin
        >
          {t('in-automation:ActionCatalog.run')}
        </Button>
      );
    }
  }
  if (action.type !== ACTION_TYPE.EXTERNAL) {
    return (
      <HorizontalFlexWrapper className={locals.rowActions}>
        {action.type === ACTION_TYPE.DOC_LINK && role?.canRunAutomationActions && (
          <div>
            <Spacer horizontal="medium" />
            <Link
              target="_blank"
              onClick={e => {
                e.stopPropagation();
                runActionTrackerSegment({
                  actionName: action.name,
                  actionType: action.type,
                  fromRecommendedActions: true,
                  aiOriginated: false
                });
              }}
              href={getDocLinkFromFields(action.fields).value}
            >
              {t('in-automation:ActionCatalog.launch')}{' '}
              <SvgIcon size="s" type="lib_views_external_link" color="var(--cds-link-primary)" />
            </Link>
          </div>
        )}
        {action.type !== ACTION_TYPE.DOC_LINK && role?.canRunAutomationActions && (
          <Button
            kind="action"
            icon={action.type === ACTION_TYPE.MANUAL ? 'lib_views_show' : 'lib_actions_play'}
            onClick={e => {
              // Track manual action viewed
              stopPropagationAndPreventDefault(e);
              addActiveDialog(<RunActionDialog action={action} volatileId={volatileId} event={event} />);
              if (action.type === ACTION_TYPE.MANUAL) {
                runActionTrackerSegment({
                  actionName: action.name,
                  actionType: action.type,
                  fromRecommendedActions: true,
                  aiOriginated: isAIAction(action) || isAIActionCopy(action) ? true : false
                });
              }
            }}
            noAutoMargin
          >
            {action.type === ACTION_TYPE.MANUAL
              ? t('in-automation:ActionCatalog.view')
              : t('in-automation:ActionCatalog.run')}
          </Button>
        )}
        {role?.canConfigureAutomationPolicies && action.type !== ACTION_TYPE.EXTERNAL && (
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
  return null;
}

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
          {!isLoading(trigger) && (
            <GenerateAIActionButton event={event} trigger={trigger} ootbRecommendedActions={ootbRecommendedActions} />
          )}
          <TypeFilter type={types} setType={params => setTypes({ types: params.types })} showExternal />
          <AiEngineFilter availableAiEngines={availableAiEngines} aiEngine={aiEngine} setAiEngine={setAiEngine} />
          <TagsFilter availableTags={availableTags} tags={tags} setTags={setTags} />
          <Spacer horizontal="small" />
        </Stack>
      }
      searchPlaceholder={t('in-automation:searchActions')}
    />
  );
}
