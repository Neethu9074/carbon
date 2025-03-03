/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, IconButton, Spacer, Typography, Link, SvgIcon } from '@instana/components';
import { Event, Policy, Result, VolatileId } from '@instana/types';
import { themes } from '@instana/design-tokens';

import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { nameColumn, actionNameColumn as policyActionNameColumn } from 'in-automation/PolicyTable/columnDefinitions';
import { refresh, usePaginatedPolicies } from 'in-automation/AutomationCard/usePolicies';
import CreatePoliciesDialog from 'in-automation/AutomationCard/CreatePoliciesDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ACTION_TYPE, EXECUTABLE_ACTIONS } from 'in-automation/constants';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ScoredAction, TriggerSpecification } from 'in-automation/types';
import { isAIAction, isAIActionCopy } from 'in-automation/utils/action';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { getDocLinkFromFields } from 'in-automation/utils/actionField';
import { TagsFilter } from 'in-automation/components/tableFilters';
import { useSegmentTracker } from 'in-automation/tracker';
import { isManual } from 'in-automation/utils/policy';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { mapData } from 'in-services/util/result';
import { deletePolicy } from 'in-automation/api';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

const pathSegment = '/policies';
const matrixPrefix = '';

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

function CreatePoliciesButton({
  event,
  actions,
  trigger
}: {
  event: Event;
  actions: Result<ScoredAction[]>;
  trigger: Result<TriggerSpecification>;
}) {
  if (!role?.canConfigureAutomationPolicies) return null;
  return (
    <Button
      kind="action"
      onClick={() => addActiveDialog(<CreatePoliciesDialog event={event} actions={actions} trigger={trigger} />)}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-automation:policies.createPolicies')}
    </Button>
  );
}

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

interface AutomationPoliciesTableProps extends ServerTablePresenterProps<Policy> {
  volatileId: VolatileId;
  event: Event;
}

function ExecuteButton({ policy, volatileId, event }: { policy: Policy; volatileId: VolatileId; event: Event }) {
  const { runActionTrackerSegment } = useSegmentTracker();

  if (!isManual(policy)) return null;
  const action = policy.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action;
  const { type, fields } = action;
  const isExecutable = EXECUTABLE_ACTIONS.includes(type);
  if (type === ACTION_TYPE.DOC_LINK) {
    const value = getDocLinkFromFields(fields).value;
    return (
      <Link
        target="_blank"
        onClick={e => {
          e.stopPropagation();
          runActionTrackerSegment({
            actionName: action.name,
            actionType: action.type,
            policyName: policy.name,
            policyType: 'manual',
            aiOriginated: false
          });
        }}
        href={value}
      >
        {t('in-automation:ActionCatalog.launch')}{' '}
        <SvgIcon size="s" type="lib_views_external_link" color="var(--cds-link-primary)" />
      </Link>
    );
  } else if (isExecutable) {
    return (
      <Button
        kind="action"
        icon="lib_actions_play"
        onClick={e => {
          stopPropagationAndPreventDefault(e);
          addActiveDialog(
            <RunActionDialog action={action} executePolicy={policy} volatileId={volatileId} event={event} />
          );
        }}
        noAutoMargin
      >
        {t('in-automation:ActionCatalog.run')}
      </Button>
    );
  } else if (type === ACTION_TYPE.MANUAL) {
    return (
      <Button
        kind="action"
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
        noAutoMargin
      >
        {t('in-automation:ActionCatalog.view')}
      </Button>
    );
  } else {
    return null;
  }
}

const executeColumn: ColumnDefinition<Policy, AutomationPoliciesTableProps> = {
  id: 'execute',
  width: 9,
  label: '',
  getContent: (policy, { volatileId, event }) => <ExecuteButton policy={policy} volatileId={volatileId} event={event} />
};

const deleteColumn: ColumnDefinition<Policy, AutomationPoliciesTableProps> = {
  label: '',
  id: 'actions',
  sortable: false,
  width: 5,
  getContent(item) {
    return (
      <Tooltip content={t('in-automation:deletePolicyWithName', { actionName: item.name })} overwriteBlock>
        <IconButton
          color={themes.default.ids.color.option.blue['400']}
          type="lib_actions_delete"
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            showConfirmationDialog(item);
          }}
        />
      </Tooltip>
    );
  }
};

const columnDefinitions: ColumnDefinition<Policy, AutomationPoliciesTableProps>[] = [
  nameColumn,
  policyActionNameColumn,
  tagsColumn as ColumnDefinition<Policy, AutomationPoliciesTableProps>
];

if (role?.canRunAutomationActions) {
  columnDefinitions.push(executeColumn);
}

if (role?.canConfigureAutomationPolicies) {
  columnDefinitions.push(deleteColumn);
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

  const availableTags = [...new Set(policies.data?.flatMap(({ tags }) => tags ?? []))];

  const { filteredPolicies, tags, setTags } = usePolicyFilters({ policies, setServerTableUrlState });

  const paginatedPolicies = usePaginatedPolicies({
    serverTableUrlState,
    setServerTableUrlState,
    policies: filteredPolicies
  });

  const totalHits = paginatedPolicies?.data?.totalHits;

  return (
    <ServerTablePresenter<Policy, AutomationPoliciesTableProps>
      volatileId={volatileId}
      event={event}
      columnDefinitions={columnDefinitions}
      fixedLayout
      leftHeader={
        <Typography variant="heading-300">
          {paginatedPolicies?.progress.loading
            ? t('in-automation:automationPolicies')
            : t('in-automation:automationPoliciesWithCount', { count: totalHits })}
        </Typography>
      }
      onChange={setServerTableUrlState}
      orderBy={orderBy}
      orderDirection={orderDirection}
      page={page}
      pageSize={pageSize}
      query={query}
      result={paginatedPolicies}
      rightHeader={
        <>
          <CreatePoliciesButton event={event} actions={actions} trigger={trigger} />
          <Spacer horizontal="small" />
          <TagsFilter availableTags={availableTags} tags={tags} setTags={setTags} />
          <Spacer horizontal="small" />
        </>
      }
      searchMaxWidth={180}
      searchPlaceholder={t('in-automation:policies.searchPolicies')}
    />
  );
}
