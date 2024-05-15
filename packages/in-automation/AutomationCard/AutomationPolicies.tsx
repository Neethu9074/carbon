/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, Typography, Spacer, Stack } from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  isDocLink,
  isScript,
  isWebhook,
  isGithub,
  isGitlab,
  isJira,
  getDocLinkFromFields,
  isAnsible,
  isManual,
  isExternal
} from 'in-automation/ActionCatalog/shared';
import {
  nameColumn as actionNameColumn,
  aiEngineColumn,
  scoreColumn,
  descriptionColumn
} from 'in-automation/ActionTable/columnDefinitions';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { actionNameColumn as policyActionNameColumn, nameColumn } from 'in-automation/PolicyTable/columnDefinitions';
import { NewPolicy, TriggerSpecification, isManual as isManualPolicy } from 'in-automation/Policies/types';
import useNavigateToPolicyDetails from 'in-automation/Policies/useNavigateToPolicyDetails';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { refresh, usePaginatedPolicies } from 'in-automation/AutomationCard/usePolicies';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { runActionTracker, createBulkPoliciesTracker } from 'in-automation/tracker';
import FormFooter, { CancelButton } from 'in-components/form/FormFooter/FormFooter';
import { saveBulkPolicies, deletePolicy, ScoredAction } from 'in-automation/api';
import { close, addActiveDialog } from 'in-components/DialogPresenter/store';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { createBasePolicy } from 'in-automation/AutomationCard/shared';
import { TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { Policy, VolatileId, Event, Result, Error } from 'in-types';
import { TagsFilter } from 'in-automation/components/tableFilters';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { mapData } from 'in-services/util/result';
import Dialog from 'in-components/Dialog/Dialog';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

const pathSegment = '/policies';
const matrixPrefix = '';

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

function onCreateSuccess(count: number) {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-automation:policies.createBulkDialog.success.content', { count }),
      title: t('in-automation:policies.createBulkDialog.success.title')
    },
    'policy-bulk-create-info'
  );
}

function onCreateFailed(error: Error) {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: (
        <Trans i18nKey="in-automation:policies.createBulkDialog.failure.content" values={{ error: error.message }} />
      ),
      title: t('in-automation:policies.createBulkDialog.failure.title')
    },
    'policy-bulk-create-error'
  );
}

function onCreate(policies: NewPolicy[], actionNames: string[], triggerName?: string) {
  saveBulkPolicies(policies).once(
    () => {
      onCreateSuccess(policies.length);
      createBulkPoliciesTracker({
        triggerName: triggerName ?? '',
        actionNames
      });
      close();
      refresh();
    },
    err => {
      close();
      onCreateFailed(err);
    }
  );
}

function showConfirmationDialog(policy: Policy) {
  const { id, name } = policy;
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-automation:deleteDialog.pleaseConfirm')}
      description={
        <Typography variant="body-regular">
          <Trans i18nKey="in-automation:deleteDialog.pleaseConfirmMsg" values={{ name }} />
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

const getExecuteColumn = (volatileId: VolatileId, event: Event): ColumnDefinition<Policy> => ({
  id: 'execute',
  width: 9,
  label: '',
  getContent(item) {
    if (!isManualPolicy(item)) return null;
    const action = item.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action;
    const { type, fields } = action;
    const isExecutable =
      isScript(type) || isWebhook(type) || isAnsible(type) || isGithub(type) || isGitlab(type) || isJira(type);
    if (isDocLink(type)) {
      const value = getDocLinkFromFields(fields).value;
      return (
        <Button
          kind="action"
          icon="lib_views_external_link"
          target="_blank"
          href={value}
          onClick={e => {
            e.stopPropagation();
            runActionTracker({
              actionType: action.type,
              actionName: action.name,
              policyId: item.id,
              policyName: item.name
            });
          }}
          noAutoMargin
        >
          {t('in-automation:ActionCatalog.launch')}
        </Button>
      );
    } else if (isExecutable) {
      return (
        <Button
          kind="action"
          icon="lib_actions_play"
          onClick={e => {
            e.stopPropagation();
            addActiveDialog(
              <RunActionDialog action={action} executePolicy={item} volatileId={volatileId} event={event} />
            );
          }}
          noAutoMargin
        >
          {t('in-automation:ActionCatalog.run')}
        </Button>
      );
    } else if (isManual(type)) {
      return (
        <Button
          kind="action"
          icon="lib_views_show"
          onClick={e => {
            e.stopPropagation();
            addActiveDialog(<RunActionDialog action={action} volatileId={volatileId} event={event} />);
            runActionTracker({
              actionType: action.type,
              actionName: action.name,
              policyId: item.id,
              policyName: item.name
            });
          }}
          noAutoMargin
        >
          {t('in-automation:ActionCatalog.view')}
        </Button>
      );
    } else {
      return null;
    }
  }
});

const deleteColumn: ColumnDefinition<Policy> = {
  label: '',
  id: 'actions',
  sortable: false,
  width: 5,
  getContent(item) {
    return (
      <Tooltip content={t('in-automation:deletePolicyWithName', { actionName: item.name })}>
        <IconButton
          color={themes.default.ids.color.option.blue['400']}
          type="lib_actions_delete"
          onClick={e => {
            e.stopPropagation();
            showConfirmationDialog(item);
          }}
        />
      </Tooltip>
    );
  }
};

const columnDefinitions: ColumnDefinition<Policy>[] = [
  nameColumn,
  policyActionNameColumn,
  tagsColumn as ColumnDefinition<Policy>
];

// TODO: This is duplicated from policy form, need to figure out something better
function useActionFilters({
  actions,
  setServerTableUrlState
}: {
  actions: Result<ScoredAction[]>;
  setServerTableUrlState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [type, setType] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const filters = [
    {
      key: 'type' as const,
      value: type
    },
    {
      key: 'tags' as const,
      value: tags
    }
  ];

  return {
    filteredActions: mapData(actions, data =>
      data.filter(
        action =>
          !isExternal(action.type) &&
          filters.reduce((shouldInclude, filter) => {
            const emptyFilter = !filter.value?.length;
            if (emptyFilter) return shouldInclude;
            switch (filter.key) {
              case 'type':
                return (shouldInclude = shouldInclude && filter.value === action.type);
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
    tags,
    setTags: (tags: string[]) => {
      setTags(tags);
      setServerTableUrlState({ page: 1, query: '' });
    }
  };
}

interface SelectActionsDialogProps {
  event: Event;
  actions: Result<ScoredAction[]>;
  trigger: Result<TriggerSpecification>;
}

function SelectActionsDialog({ event, actions, trigger }: SelectActionsDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'score',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const actionTags = [...new Set(actions.data?.flatMap(({ tags }) => tags ?? []))];

  const { filteredActions, type, setType, tags, setTags } = useActionFilters({ actions, setServerTableUrlState });

  const result = usePaginatedScoredActions({
    actions: filteredActions,
    serverTableUrlState,
    setServerTableUrlState
  });

  function onSubmit() {
    const selectedActions = selectedIds
      .map(id => actions.data!.find(action => id === action.id))
      .filter((action): action is ScoredAction => !!action);

    const policies = selectedActions.map(action => createBasePolicy(event, action));
    const triggerName = trigger.data?.name;
    const actionNames = selectedActions.map(({ name }) => name);

    onCreate(policies, actionNames, triggerName);
  }

  function onChange(action: ScoredAction) {
    const updatedSelectedIds = selectedIds.includes(action.id)
      ? selectedIds.filter(id => id !== action.id)
      : [...selectedIds, action.id];
    setSelectedIds(updatedSelectedIds);
  }

  const columnDefinitions: ColumnDefinition<ScoredAction>[] = [
    {
      id: 'select',
      label: '',
      width: 5,
      getContent: action => (
        <CheckboxFancy
          label=""
          checked={selectedIds.includes(action.id)}
          onChange={e => {
            e.stopPropagation();
            onChange(action);
          }}
        />
      )
    },
    actionNameColumn,
    descriptionColumn,
    tagsColumn as ColumnDefinition<ScoredAction>,
    aiEngineColumn,
    scoreColumn
  ];

  return (
    <Dialog title={t('in-automation:policies.createPolicies')} onClose={close} withoutBodyPadding>
      <LeftRightPadding>
        <LeftRightPadding>
          <ServerTablePresenter<ScoredAction, ServerTablePresenterProps<ScoredAction>>
            leftHeader={<Typography variant="heading-300">{t('in-automation:actions')}</Typography>}
            searchPlaceholder={t('in-automation:searchActions')}
            onChange={setServerTableUrlState}
            page={page}
            onRowClick={onChange}
            pageSize={pageSize}
            result={result}
            query={query}
            rightHeader={
              <>
                <Stack direction="horizontal">
                  <TypeFilter type={type} setType={setType} showExternal />
                  <TagsFilter availableTags={actionTags} tags={tags} setTags={setTags} />
                </Stack>
                <Spacer horizontal="small" />
              </>
            }
            columnDefinitions={columnDefinitions}
            orderBy={orderBy}
            orderDirection={orderDirection}
            fixedLayout
          />
        </LeftRightPadding>
      </LeftRightPadding>
      <Spacer vertical="small" />
      <FormFooter>
        <CancelButton onClick={close} />
        <Button kind="primary" disabled={selectedIds.length === 0} onClick={onSubmit}>
          {t('in-automation:policies.createPolicies')}
        </Button>
      </FormFooter>
    </Dialog>
  );
}

function usePolicyFilters({
  policies,
  setServerTableUrlState
}: {
  policies: Result<Policy[]>;
  setServerTableUrlState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [tags, setTags] = useState<string[]>([]);

  const filters = [
    {
      key: 'tags' as const,
      value: tags
    }
  ];

  const filteredPolicies = mapData(policies, data =>
    data.filter(policy =>
      filters.reduce((shouldInclude, filter) => {
        const emptyFilter = !filter.value?.length;
        if (emptyFilter) return shouldInclude;
        switch (filter.key) {
          case 'tags':
            return shouldInclude && (policy.tags?.some(tag => filter.value?.includes(tag)) ?? false);
        }
      }, true)
    )
  );

  return {
    filteredPolicies,
    tags,
    setTags: (tags: string[]) => {
      setTags(tags);
      setServerTableUrlState({ page: 1, query: '' });
    }
  };
}

interface AutomationPoliciesProps {
  event: Event;
  volatileId: VolatileId;
  actions: Result<ScoredAction[]>;
  trigger: Result<TriggerSpecification>;
  policies: Result<Policy[]>;
}

export default function AutomationPolicies({ event, volatileId, actions, trigger, policies }: AutomationPoliciesProps) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'name',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const policyTags = [...new Set(policies.data?.flatMap(({ tags }) => tags ?? []))];

  const { filteredPolicies, tags, setTags } = usePolicyFilters({ policies, setServerTableUrlState });

  const paginatedPolicies = usePaginatedPolicies({
    serverTableUrlState,
    setServerTableUrlState,
    policies: filteredPolicies
  });

  const totalHits = paginatedPolicies?.data?.totalHits;

  const columnDefinitionsToShow = [...columnDefinitions];
  if (role?.canRunAutomationActions) {
    columnDefinitionsToShow.push(getExecuteColumn(volatileId, event));
  }
  if (role?.canConfigureAutomationPolicies) {
    columnDefinitionsToShow.push(deleteColumn);
  }

  const navigateToPolicyDetails = useNavigateToPolicyDetails();
  return (
    <ServerTablePresenter<Policy, ServerTablePresenterProps<Policy>>
      columnDefinitions={columnDefinitionsToShow}
      fixedLayout
      leftHeader={
        <Typography variant="heading-300">
          {paginatedPolicies?.progress.loading
            ? t('in-automation:automationPolicies')
            : t('in-automation:automationPoliciesWithCount', { count: totalHits })}
        </Typography>
      }
      onChange={setServerTableUrlState}
      onRowClick={policy => navigateToPolicyDetails(policy)}
      orderBy={orderBy}
      orderDirection={orderDirection}
      page={page}
      pageSize={pageSize}
      query={query}
      result={paginatedPolicies}
      rightHeader={
        <>
          {role?.canConfigureAutomationPolicies && (
            <Button
              kind="action"
              onClick={() => addActiveDialog(<SelectActionsDialog event={event} actions={actions} trigger={trigger} />)}
              icon="lib_openclose_add_circle_outline"
            >
              {t('in-automation:policies.createPolicies')}
            </Button>
          )}
          <Spacer horizontal="small" />
          <TagsFilter availableTags={policyTags} tags={tags} setTags={setTags} />
          <Spacer horizontal="small" />
        </>
      }
      searchPlaceholder={t('in-automation:policies.searchPolicies')}
    />
  );
}
