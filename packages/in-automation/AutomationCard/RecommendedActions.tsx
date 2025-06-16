/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useMemo, useEffect } from 'react';

import { Button, Spacer, Stack, Typography, CarbonButton } from '@instana/components';
import { Event, Result, VolatileId, Action, Policy } from '@instana/types';
import { TimeConfig } from '@instana/types';

import {
  scoredActionTagsColumn,
  scoredActionNameColumn,
  scoredActionDescriptionColumn,
  scoredActionAiEngineColumn,
  scoredActionScoreColumn
} from 'in-automation/ActionTable/columnDefinitions';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import useFetchAppropriateRCAEntityData from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import GenerateAIActionDialog from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import RecommendationsExplainability from 'in-automation/AutomationCard/RecommendationsExplainability';
import CreatePolicyDialog from 'in-automation/AutomationCard/CreatePolicyDialog/CreatePolicyDialog';
import { useTurboAgentSnapShots } from 'in-automation/ResourceOptimization/useResourceOptimization';
import useHrefToActionDashboard from 'in-automation/navigation/hooks/useHrefToActionDashboard';
import { ACTION_TYPE, EXECUTABLE_ACTIONS, ScoredActionsType } from 'in-automation/constants';
import useHrefToPolicyDetails from 'in-automation/navigation/hooks/useHrefToPolicyDetails';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import TurboActionRunModal from 'in-automation/ResourceOptimization/TurboActionRunModal';
import CreateNewPolicyTearsheet from 'in-automation/Policies/CreateNewPolicyTearsheet';
import { ProcessedSnapshot } from 'in-automation/AutomationCard/AutomationCardForPRC';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import CreatePolicyButton from 'in-automation/AutomationCard/CreatePolicyButton';
import { getTriggerTypeFromEvent } from 'in-automation/AutomationCard/shared';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ScoredAction, TriggerSpecification } from 'in-automation/types';
import { isAIAction, isAIActionCopy } from 'in-automation/utils/action';
import { refresh } from 'in-automation/AutomationCard/useScoredActions';
import { AiEngineFilter } from 'in-automation/ActionTable/tableFilters';
import { getDocLinkFromFields } from 'in-automation/utils/actionField';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { actionAiGenerationEnabled } from 'in-services/featureFlags';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import { TagsFilter } from 'in-automation/components/tableFilters';
import EmptyState from 'in-automation/AutomationCard/EmptyState';
import { useSegmentTracker } from 'in-automation/tracker';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import { isManual } from 'in-automation/utils/policy';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { hasError } from 'in-services/util/result';
import { mapData } from 'in-services/util/result';
import { deletePolicy } from 'in-automation/api';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from 'in-automation/AutomationCard/RecommendedActions.mless';

const pathSegment = '/recommendedActions';
const matrixPrefix = '';

interface RecommendedActionsTableProps extends ServerTablePresenterProps<ScoredAction> {
  volatileId: VolatileId;
  event: Event;
  trigger: Result<TriggerSpecification>;
}

const actionColumn: ColumnDefinition<ScoredAction, RecommendedActionsTableProps> = {
  label: '',
  id: 'actions',
  sortable: false,
  width: 5,
  getContent: (scoredAction, { volatileId, event, trigger }) => (
    <RecActionsMoreMenu scoredAction={scoredAction} volatileId={volatileId} event={event} trigger={trigger} />
  )
};
function onDeleteSuccess() {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-automation:policies.deleteDialog.success')
    },
    'policy-delete-info'
  );
}

function onDeleteFailed() {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: t('in-automation:policies.deleteDialog.failure')
    },
    'policy-delete-error'
  );
}

function onDelete(id: string) {
  deletePolicy(id).once(
    () => {
      onDeleteSuccess();
      refresh();
    },
    () => {
      onDeleteFailed();
    }
  );
}

function showConfirmationDialog(policy: Policy) {
  const { id, name } = policy;
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-automation:deleteDialog.confirmRemove')}
      description={
        <Typography variant="body-regular">
          <Trans i18nKey="in-automation:deleteDialog.confirmRemoveMsg" values={{ name }} />
        </Typography>
      }
      confirmButtonLabel={t('in-automation:deleteDialog.delete')}
      onSubmit={() => {
        close();
        onDelete(id);
      }}
    />
  );
}

const handleButtonClick = ({ policyId, inEventPage }: { policyId?: string; inEventPage?: boolean }) => {
  addActiveDialog(<CreateNewPolicyTearsheet policyId={policyId} inEventPage={inEventPage} />);
};
export function RecActionsMoreMenu({
  scoredAction,
  volatileId,
  event,
  trigger
}: {
  scoredAction: ScoredAction;
  volatileId: VolatileId;
  event: Event;
  trigger: Result<TriggerSpecification>;
}) {
  const { runActionTrackerSegment } = useSegmentTracker();
  const { entityId } = event;
  const agentSnapShots = useTurboAgentSnapShots();
  const hrefToActionDashboard = useHrefToActionDashboard();
  const hrefToPolicyDetails = useHrefToPolicyDetails();
  const agents = agentSnapShots?.data?.online ?? [];
  const entityType = scoredAction.entity as Action;
  const policy = scoredAction.entity as Policy;
  if (scoredAction.aiEngine !== 'POLICY' && entityType !== undefined && entityType.type === ACTION_TYPE.EXTERNAL) {
    const isManualExternal = entityType.metadata?.ai;

    if (!isManualExternal) return null;
    if (isManualExternal) {
      if (!role?.canRunAutomationActions) return null;

      return (
        <Stack align="end">
          <MoreMenu kind="subtle">
            <MoreMenuButton
              icon="lib_actions_play"
              requireTitle
              title={t('in-automation:viewRunAction')}
              onClick={e => {
                stopPropagationAndPreventDefault(e);
                addActiveDialog(
                  <TurboActionRunModal
                    action={scoredAction}
                    agents={agents}
                    eventId={event?.id}
                    targetSnapshotId={entityId}
                  />
                );
              }}
            >
              {t('in-automation:viewRunAction')}
            </MoreMenuButton>
          </MoreMenu>
        </Stack>
      );
    }
  }

  if (scoredAction.aiEngine === 'POLICY' && policy !== undefined) {
    if (!isManual(policy)) return null;
    const action = policy.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action;
    const { type } = action;
    const isExecutable = EXECUTABLE_ACTIONS.includes(type);

    return (
      <Stack align="end">
        <MoreMenu kind="subtle">
          {role?.canRunAutomationActions && action.type === ACTION_TYPE.DOC_LINK && (
            <MoreMenuButton
              icon="lib_views_external_link"
              onClick={() => {
                window.open(getDocLinkFromFields(action.fields).value, '_blank')?.focus();
              }}
            >
              {t('in-automation:ActionCatalog.launch')}
            </MoreMenuButton>
          )}

          {role?.canRunAutomationActions && isExecutable && (
            <MoreMenuButton
              icon="lib_actions_play"
              requireTitle
              title={t('in-automation:viewRunPolicy')}
              onClick={e => {
                stopPropagationAndPreventDefault(e);
                addActiveDialog(
                  <RunActionDialog action={action} executePolicy={policy} volatileId={volatileId} event={event} />
                );
              }}
            >
              {t('in-automation:viewRunPolicy')}
            </MoreMenuButton>
          )}

          {role?.canRunAutomationActions && type === ACTION_TYPE.MANUAL && (
            <MoreMenuButton
              icon="lib_views_show"
              onClick={e => {
                stopPropagationAndPreventDefault(e);
                addActiveDialog(<RunActionDialog action={action} volatileId={volatileId} event={event} />);
                // Track manual action viewed
                runActionTrackerSegment({
                  actionName: action.name,
                  actionType: action.type,
                  policyName: policy.name,
                  policyType: 'manual',
                  aiOriginated: isAIAction(action) || isAIActionCopy(action) ? true : false
                });
              }}
            >
              {t('in-automation:ActionCatalog.view')}
            </MoreMenuButton>
          )}

          <MoreMenuButton
            icon="lib_views_show"
            requireTitle
            title={t('in-automation:viewPolicyDashboard')}
            href={hrefToPolicyDetails(policy.id)}
          >
            {t('in-automation:viewPolicyDashboard')}
          </MoreMenuButton>

          {role?.canConfigureAutomationPolicies && (
            <>
              <MoreMenuButton
                icon="lib_actions_edit"
                onClick={e => {
                  stopPropagationAndPreventDefault(e);
                  handleButtonClick({ policyId: policy.id, inEventPage: true });
                }}
              >
                {t('in-automation:editPolicy')}
              </MoreMenuButton>

              <MoreMenuButton
                icon="lib_actions_delete"
                hasDivider
                onClick={e => {
                  stopPropagationAndPreventDefault(e);
                  showConfirmationDialog(policy);
                }}
              >
                {t('in-automation:deletePolicy')}
              </MoreMenuButton>
            </>
          )}
        </MoreMenu>
      </Stack>
    );
  }

  if (scoredAction.aiEngine !== 'POLICY' && entityType !== undefined && entityType.type !== ACTION_TYPE.EXTERNAL) {
    const { type, fields, id } = entityType;
    const isExecutable = EXECUTABLE_ACTIONS.includes(type);

    return (
      <Stack align="end">
        <MoreMenu kind="subtle">
          {role?.canRunAutomationActions && type === ACTION_TYPE.DOC_LINK && (
            <MoreMenuButton
              icon="lib_views_external_link"
              onClick={() => {
                window.open(getDocLinkFromFields(fields).value, '_blank')?.focus();
              }}
            >
              {t('in-automation:ActionCatalog.launch')}
            </MoreMenuButton>
          )}

          {role?.canRunAutomationActions && isExecutable && (
            <MoreMenuButton
              icon="lib_actions_play"
              requireTitle
              title={t('in-automation:viewRunAction')}
              onClick={e => {
                stopPropagationAndPreventDefault(e);
                addActiveDialog(<RunActionDialog action={entityType} volatileId={volatileId} event={event} />);
              }}
            >
              {t('in-automation:viewRunAction')}
            </MoreMenuButton>
          )}

          {role?.canRunAutomationActions && type === ACTION_TYPE.MANUAL && (
            <MoreMenuButton
              icon="lib_views_show"
              onClick={e => {
                stopPropagationAndPreventDefault(e);
                addActiveDialog(<RunActionDialog action={entityType} volatileId={volatileId} event={event} />);
                // Track manual action viewed
                runActionTrackerSegment({
                  actionName: entityType.name,
                  actionType: entityType.type,
                  policyName: policy.name,
                  policyType: 'manual',
                  aiOriginated: isAIAction(entityType) || isAIActionCopy(entityType) ? true : false
                });
              }}
            >
              {t('in-automation:ActionCatalog.view')}
            </MoreMenuButton>
          )}

          <MoreMenuButton
            icon="lib_views_show"
            requireTitle
            title={t('in-automation:viewActionDashboard')}
            href={hrefToActionDashboard(id)}
          >
            {t('in-automation:viewActionDashboard')}
          </MoreMenuButton>

          {role?.canConfigureAutomationPolicies && (
            <MoreMenuButton
              icon="lib_openclose_add_circle_outline"
              requireTitle
              title={t('in-automation:createPolicy')}
              onClick={e => {
                stopPropagationAndPreventDefault(e);
                addActiveDialog(<CreatePolicyDialog trigger={trigger} action={entityType} event={event} />);
              }}
            >
              {t('in-automation:createPolicy')}
            </MoreMenuButton>
          )}
        </MoreMenu>
      </Stack>
    );
  }
  return null;
}

const columnDefinitions: ColumnDefinition<ScoredAction, RecommendedActionsTableProps>[] = [
  scoredActionNameColumn as ColumnDefinition<ScoredAction, RecommendedActionsTableProps>,
  scoredActionAiEngineColumn as ColumnDefinition<ScoredAction, RecommendedActionsTableProps>,
  scoredActionDescriptionColumn as ColumnDefinition<ScoredAction, RecommendedActionsTableProps>,
  scoredActionTagsColumn as ColumnDefinition<ScoredAction, RecommendedActionsTableProps>,
  scoredActionScoreColumn,
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
  const [aiEngine, setAiEngine] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const filters = [
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
      data.filter(scoredAction =>
        filters.reduce((shouldInclude, filter) => {
          const emptyFilter = !filter.value?.length;
          if (emptyFilter) return shouldInclude;
          switch (filter.key) {
            case 'aiEngine':
              return (shouldInclude = shouldInclude && filter.value === ScoredActionsType[scoredAction.aiEngine]);
            case 'tags':
              return shouldInclude && (scoredAction.entity?.tags?.some(tag => filter.value?.includes(tag)) ?? false);
          }
        }, true)
      )
    ),
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
    defaultPageSize: 5,
    defaultPageSizes: [5, 10, 15, 20]
  });
  const showOotbActions =
    getTriggerTypeFromEvent(event) === 'builtinEvent' && (ootbRecommendedActions.data?.length ?? 0) > 0;

  const { page, pageSize, orderBy, orderDirection, query, pageSizes } = serverTableUrlState;
  const availableAiEngines = [...new Set(recommendedActions.data?.map(({ aiEngine }) => ScoredActionsType[aiEngine]))];
  const availableTags = Array.from(new Set(recommendedActions.data?.flatMap(item => item.entity?.tags ?? [])));
  const data = useMemo(() => {
    const selectedSnapshot = initialSnapshots?.find(snapshot => snapshot.rcaSnapshotID === selectedRCA);

    if (!selectedSnapshot) return null; // Return null if no matching RCA is found

    return {
      rcaEntityType: selectedSnapshot.rcaEntityType, // Get entity type
      rcaSnapshotID: selectedRCA, // Use selected RCA ID
      entityId: selectedSnapshot?.translationEntityType,
      timeWindow // Ensure timeWindow is available in the scope
    };
  }, [selectedRCA, initialSnapshots, timeWindow]);

  const { entityData, entityType } = useFetchAppropriateRCAEntityData(
    data?.rcaEntityType ?? '', // Pass null if data is not available
    data?.rcaSnapshotID ?? '',
    data?.timeWindow ?? globalTimeConfig
  );
  const entityId = data?.entityId ?? 'process';

  useEffect(() => {
    if (
      entityData &&
      entityType &&
      entityData.label &&
      setSelectedDescription &&
      setSelectedEntityType &&
      selectedRCA !== 'triggeringEvent'
    ) {
      const entityTypeName =
        entityType === 'infrastructure' || entityType === 'process'
          ? translateFullyQualifiedPluginToShortPluginName(entityId) || ''
          : entityType;

      setSelectedDescription(entityData.label);
      setSelectedEntityType(entityTypeName);
    }
  }, [entityData, entityType, setSelectedDescription, setSelectedEntityType, selectedRCA, entityId]);

  const { filteredActions, aiEngine, setAiEngine, tags, setTags } = useFilters({
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
        <>
          <Spacer vertical="small" />
          <Stack direction="horizontal">
            <Typography variant="body-regular">{t('in-automation:contextFor')}</Typography>
            <ComboBox
              id="contextmenu"
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
          <Spacer vertical="small" />
        </>
      )}
      <Spacer vertical="small" />
      <Stack direction="horizontal" gap="disabled">
        <Typography variant="body-regular">
          {t('in-automation:recommendedActionsExplanability.linkExplanation')}
        </Typography>
        <CarbonButton
          className={locals.learnMoreButton}
          kind="ghost"
          onClick={() => addActiveDialog(<RecommendationsExplainability />)}
        >
          {t('in-automation:recommendedActionsExplanability.link')}
        </CarbonButton>
      </Stack>

      <ServerTablePresenter<ScoredAction, RecommendedActionsTableProps>
        columnDefinitions={columnDefinitions}
        volatileId={volatileId}
        event={event}
        pageSizes={pageSizes}
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
        page={page}
        pageSize={pageSize}
        query={query}
        result={result}
        renderNoDataAvailable={() => <EmptyState event={event} />}
        rightHeader={
          <Stack direction="horizontal">
            {(showOotbActions || actionAiGenerationEnabled) && !isLoading(trigger) && (
              <GenerateAIActionButton
                event={event}
                trigger={trigger}
                ootbRecommendedActions={ootbRecommendedActions}
                selectedDescription={selectedDescription}
                selectedEntityType={selectedEntityType}
              />
            )}

            {role?.canConfigureAutomationPolicies && !isLoading(trigger) && <CreatePolicyButton event={event} />}
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
