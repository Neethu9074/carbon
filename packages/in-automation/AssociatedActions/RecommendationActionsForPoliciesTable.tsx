/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { Spacer, Stack, Link } from '@instana/components';
import { Button } from '@instana/legacy';

import {
  ANSIBlE_TYPE,
  EXTERNAL_TYPE,
  SCRIPT_TYPE,
  WEBHOOK_TYPE,
  GITHUB_TYPE,
  GITLAB_TYPE,
  JIRA_TYPE,
  DOC_LINK_TYPE,
  MANUAL_TYPE
} from 'in-automation/ActionCatalog/shared';
import { Action, ApplicationAlertConfigWithMetadata, Policy, Result, VolatileId, Event } from 'in-types';
import { descriptionColumn, tagsColumn, typeColumn } from 'in-automation/ActionCatalog/ActionTable';
import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { createPolicyTracker, executeTurboActionTracker } from 'in-automation/tracker';
import ComboBox, { hasMultipleValuesSelected } from 'in-components/ComboBox/ComboBox';
import { ScoredAction, saveNewPolicy, EventSpecification } from 'in-automation/api';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import usePaginatedResult from 'in-automation/Policies/usePaginatedResult';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { usePagination } from 'in-automation/Policies/usePagination';
import { isExternal } from 'in-automation/ActionCatalog/shared';
import { isLoading, hasError } from 'in-services/util/result';
import IconButton from 'in-components/IconButton/IconButton';
import { NewPolicy } from 'in-automation/Policies/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { success } from 'in-services/util/result';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './RecommendationActionsTable.mless';

interface RecommendedActionsCardAlertsProps {
  unusedSuggestedActions: ScoredAction[];
  eventSpecification: EventSpecification | ApplicationAlertConfigWithMetadata;
  triggerReload: () => void;
  isCustomEvent: boolean;
  isApplicationSmartAlert?: boolean;
  setSelectedType: (str: string) => void;
  volatileId: VolatileId;
  event: Event;
}

export default function RecommendationActionForPoliciesTable({
  unusedSuggestedActions,
  eventSpecification,
  triggerReload,
  isCustomEvent,
  isApplicationSmartAlert = false,
  setSelectedType,
  volatileId,
  event
}: RecommendedActionsCardAlertsProps) {
  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = usePagination('score', 'DESC');
  const { filteredActions, types, setTypes, aiEngines, setAiEngines } = useFilters(
    unusedSuggestedActions,
    setServerTableState
  );

  const actionAIEngines: string[] = [...new Set(unusedSuggestedActions.flatMap(action => action.aiEngine ?? []))];
  const result = usePaginatedResult(success(filteredActions), { page, pageSize, orderBy, orderDirection, query }, [
    'name',
    'description',
    'type',
    action => action?.tags?.toString() ?? ''
  ]);

  const totalHits = result?.data?.totalHits;
  return (
    <ServerTablePresenter
      onChange={setServerTableState}
      page={page}
      pageSize={7}
      leftHeader={
        <div className={locals.leftHeader}>{t('in-automation:recommendedActionsCount', { count: totalHits })} </div>
      }
      result={result}
      searchPlaceholder={t('in-automation:searchActions')}
      query={query}
      rightHeader={
        <ActionFilters
          types={types}
          actionAIEngines={actionAIEngines}
          setTypes={setTypes}
          aiEngines={aiEngines}
          setAIEngines={setAiEngines}
        />
      }
      columnDefinitions={[
        nameColumn,
        descriptionColumn,
        typeColumn,
        tagsColumn,
        aiEngineColumn,
        scoreColumn,
        {
          id: 'selectAction',
          label: '',
          sortable: false,
          width: '10',
          widthInAbsoluteUnit: true,
          getContent: (item: Action) =>
            !isExternal(item.type) ? (
              <Tooltip content={t('in-automation:associateActionWithName', { actionName: item.name })} delay={500}>
                <IconButton
                  kind="primaryv2"
                  type={'lib_openclose_add_circle_outline'}
                  onClick={e => {
                    stopPropagationAndPreventDefault(e);
                    associateAction({
                      action: item,
                      event: eventSpecification,
                      triggerReload,
                      isCustomEvent,
                      setSelectedType,
                      isApplicationSmartAlert
                    });
                  }}
                />
              </Tooltip>
            ) : role?.canRunAutomationActions &&
              isExternal(item.type) &&
              item?.metadata?.ai &&
              item?.metadata?.ai[0]?.turbonomicActionMode === 'MANUAL' ? (
              <Button // we are executing turbo actions directly from recommendation card
                kind="action"
                icon={'lib_actions_play'}
                onClick={() =>
                  addActiveDialog(
                    <RunActionDialog
                      action={item}
                      volatileId={volatileId}
                      event={event}
                      triggerReload={triggerReload}
                    />
                  )
                }
                noAutoMargin
              >
                {t('in-automation:ActionCatalog.run')}
              </Button>
            ) : (
              <div />
            )
        }
      ]}
      orderBy={orderBy}
      orderDirection={orderDirection}
    />
  );
}

const options = [
  { value: DOC_LINK_TYPE, label: t('in-automation:ActionCatalog.docLink') },
  { value: SCRIPT_TYPE, label: t('in-automation:ActionCatalog.script') },
  { value: WEBHOOK_TYPE, label: t('in-automation:ActionCatalog.http') },
  { value: MANUAL_TYPE, label: t('in-automation:ActionCatalog.manual') },
  { value: ANSIBlE_TYPE, label: t('in-automation:ActionCatalog.ansible') },
  { value: EXTERNAL_TYPE, label: t('in-automation:actionHistory.external') },
  { value: GITHUB_TYPE, label: t('in-automation:ActionCatalog.github') },
  { value: GITLAB_TYPE, label: t('in-automation:ActionCatalog.gitlab') },
  { value: JIRA_TYPE, label: t('in-automation:ActionCatalog.jira') }
];

function ActionFilters({
  types,
  actionAIEngines,
  aiEngines,
  setAIEngines,
  setTypes
}: {
  types: string[];
  actionAIEngines: string[];
  aiEngines: string[];
  setAIEngines: React.Dispatch<React.SetStateAction<string[]>>;
  setTypes: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <>
      <Stack direction="horizontal">
        <ComboBox
          options={options}
          placeholder={t('in-automation:type')}
          value={types}
          onChange={newValue => {
            if (!newValue) {
              setTypes([]);
            } else if (hasMultipleValuesSelected(newValue)) {
              setTypes(newValue.map(o => o.value));
            } else {
              setTypes([newValue.value]);
            }
          }}
        />
        <ComboBox
          options={actionAIEngines.map(tag => ({ value: tag, label: tag }))}
          placeholder={t('in-automation:engine')}
          value={aiEngines}
          onChange={newValue => {
            if (!newValue) {
              setAIEngines([]);
            } else if (hasMultipleValuesSelected(newValue)) {
              setAIEngines(newValue.map(o => o.value));
            } else {
              setAIEngines([newValue.value]);
            }
          }}
        />
      </Stack>
      <Spacer horizontal="small" />
    </>
  );
}

interface AssociateActionProps {
  action: Action;
  event: EventSpecification | ApplicationAlertConfigWithMetadata;
  triggerReload: () => void;
  isCustomEvent: boolean;
  setSelectedType: (str: string) => void;
  isApplicationSmartAlert?: boolean;
}

function associateAction({
  action,
  event,
  triggerReload,
  isCustomEvent,
  setSelectedType,
  isApplicationSmartAlert
}: AssociateActionProps) {
  const policy = getPolicySpecification(action, event, isCustomEvent, isApplicationSmartAlert);

  const onSave = (response: Result<Policy>) => {
    if (hasError(response)) {
      onCreateFailed();
    } else {
      createPolicyTracker({
        name: policy.name,
        triggerName: event.name,
        actionName: action.name,
        type: 'manual'
      });
      triggerReload();
      setSelectedType('associatedPolicies');
      oncreateSuccess(policy.name);
    }
  };

  return saveNewPolicy(policy)
    .filter(res => !isLoading(res))
    .once(onSave);
}

function oncreateSuccess(name: string) {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      title: t('in-automation:policies.onCreateSuccessTitle'),
      content: t('in-automation:policies.onCreateSuccessContent', {
        name
      })
    },
    'policy-success-info'
  );
}

function onCreateFailed() {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      title: t('in-automation:policies.onSaveFailedTitle'),
      content: t('in-automation:policies.onAssociateFailedContent')
    },
    'policy-fail-error'
  );
}

function getPolicySpecification(
  action: Action,
  event: EventSpecification | ApplicationAlertConfigWithMetadata,
  isCustomEvent: boolean,
  isApplicationSmartAlert?: boolean
): NewPolicy {
  const triggerType = isApplicationSmartAlert
    ? 'applicationSmartAlert'
    : isCustomEvent
    ? 'customEvent'
    : 'builtinEvent';
  return {
    name: `Policy_${action.name}_${action.id}`,
    description: action.description as string,
    tags: [],
    trigger: {
      type: triggerType,
      id: event.id
    },
    typeConfigurations: [
      {
        name: 'manual',
        runnable: {
          id: action.id,
          type: 'action',
          runConfiguration: {
            actions: [
              {
                action: { id: action.id },
                agentId: '123', //form.get('agentId').value,
                inputParameterValues: []
              }
            ]
          }
        }
      }
    ]
  };
}

function useFilters(
  actions: ScoredAction[],
  setServerTableState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void
) {
  const [types, setTypes] = useState<string[]>([]);
  const [aiEngines, setAiEngines] = useState<string[]>([]);

  const filters = [
    {
      key: 'type' as const,
      value: types
    },
    {
      key: 'aiEngine' as const,
      value: aiEngines
    }
  ];
  const filteredActions = actions.filter(action => {
    let shouldInclude = true;
    filters.forEach(filter => {
      const nonEmptyFilter = filter.value.length > 0;
      if (filter.key === 'type' && nonEmptyFilter) {
        shouldInclude = shouldInclude && filter.value.includes(action.type);
      } else if (filter.key === 'aiEngine' && nonEmptyFilter) {
        shouldInclude = shouldInclude && filter.value.includes(action.aiEngine);
      }
    });
    return shouldInclude;
  });
  return {
    filteredActions,
    types,
    setTypes: (types: React.SetStateAction<string[]>) => {
      setTypes(types);
      setServerTableState({ page: 1, query: '' });
    },
    aiEngines,
    setAiEngines: (aiEngines: React.SetStateAction<string[]>) => {
      setAiEngines(aiEngines);
      setServerTableState({ page: 1, query: '' });
    }
  };
}
const scoreColumn = {
  label: t('in-automation:ActionCatalog.aiScore'),
  id: 'confidence',
  width: '5',
  getContent: (row: ScoredAction) =>
    !isExternal(row.type) ? (
      <Tooltip
        content={t('in-automation:ActionCatalog.confidenceHelpText', { source: row.aiEngine })}
        align="topRight"
        delay={500}
      >
        <span className={locals.cursorPointer}>
          {t('in-automation:ActionCatalog.confidence', { context: row.confidence })}
        </span>
      </Tooltip>
    ) : (
      <div />
    ),
  getValue: (row: ScoredAction) => {
    return row.score;
  }
};

const handleTracking = (name: string) => {
  executeTurboActionTracker({
    actionName: name,
    actionType: 'Turbonomic',
    page: 'Recommended actions'
  });
};

const nameColumn = {
  label: t('in-automation:name'),
  id: 'name',
  width: '20',
  ellipsis: true,
  getContent(row: Action) {
    const description = row?.description ?? row.name;
    return (
      <Tooltip content={row.name} delay={500}>
        {isExternal(row.type) ? (
          <Link ellipsis href={row.name} external onClick={() => handleTracking(row.name)}>
            <span
              className={classNames({
                [locals.block]: true,
                [locals.ellipsis]: description.length > 60
              })}
            >
              {description}
            </span>
          </Link>
        ) : (
          <span
            className={classNames({
              [locals.block]: true,
              [locals.ellipsis]: description.length > 60
            })}
          >
            {row.name}
          </span>
        )}
      </Tooltip>
    );
  }
};

const aiEngineColumn = {
  label: t('in-automation:aiEngine'),
  id: 'engine',
  width: '5',
  getContent(row: ScoredAction) {
    return (
      <span className={locals.cursorPointer}>
        {row.aiEngine.startsWith('A similar event') ? t('in-automation:eventSimilarity') : row.aiEngine}
      </span>
    );
  }
};
