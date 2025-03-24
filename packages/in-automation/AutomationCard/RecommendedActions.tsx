/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useMemo, useEffect } from 'react';

import { Button, IconButton, Spacer, Stack, Typography, Link, SvgIcon } from '@instana/components';
import { Event, Result, VolatileId } from '@instana/types';
import { TimeConfig } from '@instana/types';

import {
  aiEngineColumn,
  descriptionColumn,
  nameColumn,
  scoreColumn
} from 'in-automation/ActionTable/columnDefinitions';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import useFetchAppropriateRCAEntityData from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import GenerateAIActionDialog from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import CreatePolicyDialog from 'in-automation/AutomationCard/CreatePolicyDialog/CreatePolicyDialog';
import { useTurboAgentSnapShots } from 'in-automation/ResourceOptimization/useResourceOptimization';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import TurboActionRunModal from 'in-automation/ResourceOptimization/TurboActionRunModal';
import { ProcessedSnapshot } from 'in-automation/AutomationCard/AutomationCardForPrc';
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
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import { TagsFilter } from 'in-automation/components/tableFilters';
import { useSegmentTracker } from 'in-automation/tracker';
import { ACTION_TYPE } from 'in-automation/constants';
import { isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
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
  ootbRecommendedActions,
  selectedDescription,
  selectedEntityType
}: {
  event: Event;
  trigger: Result<TriggerSpecification>;
  ootbRecommendedActions: Result<ScoredAction[]>;
  selectedDescription?: string | null;
  selectedEntityType?: string | null;
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
          <GenerateAIActionDialog
            event={event}
            trigger={trigger}
            ootbRecommendedActions={ootbRecommendedActions}
            selectedDescription={selectedDescription}
            selectedEntityType={selectedEntityType}
          />
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
  initialSnapshots?: ProcessedSnapshot[];
  timeWindow?: TimeConfig;
  setSelectedDescription?: (a: string | null) => void;
  setSelectedEntityType?: (a: string | null) => void;
  selectedDescription?: string | null;
  selectedEntityType?: string | null;
}

export default function RecommendedActions({
  volatileId,
  event,
  recommendedActions,
  trigger,
  ootbRecommendedActions,
  initialSnapshots,
  timeWindow,
  setSelectedDescription,
  setSelectedEntityType,
  selectedDescription,
  selectedEntityType
}: RecommendedActionsProps) {
  const globalTimeConfig = useTimeConfig();
  const [selectedRCA, setSelectedRCA] = useState<string>('triggeringEvent');
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
  const data = useMemo(() => {
    const selectedSnapshot = initialSnapshots?.find(snapshot => snapshot.rcaSnapshotID === selectedRCA);

    if (!selectedSnapshot) return null; // Return null if no matching RCA is found

    return {
      rcaEntityType: selectedSnapshot.rcaEntityType, // Get entity type
      rcaSnapshotID: selectedRCA, // Use selected RCA ID
      timeWindow // Ensure timeWindow is available in the scope
    };
  }, [selectedRCA, initialSnapshots, timeWindow]);

  const { entityData, entityType } = useFetchAppropriateRCAEntityData(
    data?.rcaEntityType ?? '', // Pass null if data is not available
    data?.rcaSnapshotID ?? '',
    data?.timeWindow ?? globalTimeConfig
  );

  useEffect(() => {
    if (
      entityData &&
      entityType &&
      entityData.label &&
      setSelectedDescription &&
      setSelectedEntityType &&
      selectedRCA !== 'triggeringEvent'
    ) {
      setSelectedDescription(entityData.label);
      setSelectedEntityType(entityType);
    }
  }, [entityData, entityType, setSelectedDescription, setSelectedEntityType, selectedRCA]);

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
    <>
      {initialSnapshots && initialSnapshots?.length > 0 && (
        <Stack direction="horizontal">
          <Typography variant="body-regular">Context for:</Typography>
          <ComboBox
            options={[
              { label: t('in-automation:triggeringEvent'), value: 'triggeringEvent' },
              ...initialSnapshots.map((item, index) => ({
                label:
                  initialSnapshots.length === 1
                    ? t('in-automation:probableRootCause')
                    : `${t('in-automation:probableRootCause')} ${index + 1}`,
                value: item.rcaSnapshotID ?? ''
              }))
            ]}
            id="target-agent"
            value={selectedRCA}
            isClearable={false}
            onChange={o => {
              if ((o as Option).value === 'triggeringEvent') {
                setSelectedDescription?.(null);
                setSelectedEntityType?.(null);
                setSelectedRCA((o as Option).value);
              } else {
                setSelectedRCA((o as Option).value);
              }
            }}
          />
        </Stack>
      )}
      <ServerTablePresenter<ScoredAction, RecommendedActionsTableProps>
        columnDefinitions={columnDefinitions}
        // runActionTrackerSegment={runActionTrackerSegment}
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
              <GenerateAIActionButton
                event={event}
                trigger={trigger}
                ootbRecommendedActions={ootbRecommendedActions}
                selectedDescription={selectedDescription}
                selectedEntityType={selectedEntityType}
              />
            )}
            <TypeFilter type={types} setType={params => setTypes({ types: params.types })} />
            <AiEngineFilter availableAiEngines={availableAiEngines} aiEngine={aiEngine} setAiEngine={setAiEngine} />
            <TagsFilter availableTags={availableTags} tags={tags} setTags={setTags} />
            <Spacer horizontal="small" />
          </Stack>
        }
        searchPlaceholder={t('in-automation:searchActions')}
      />
    </>
  );
}
