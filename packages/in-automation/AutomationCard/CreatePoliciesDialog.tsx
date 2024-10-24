/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, Checkbox, Spacer, Stack, Typography } from '@instana/components';
import { Event, Result } from '@instana/types';

import {
  nameColumn as actionNameColumn,
  aiEngineColumn,
  descriptionColumn,
  scoreColumn
} from 'in-automation/ActionTable/columnDefinitions';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import FormFooter, { CancelButton } from 'in-components/form/FormFooter/FormFooter';
import { ScoredAction, NewPolicy, TriggerSpecification } from 'in-automation/types';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { TrackingFunction, useSegmentTracker } from 'in-automation/tracker';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { isAIAction, isAIActionCopy } from 'in-automation/utils/action';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { createBasePolicy } from 'in-automation/AutomationCard/shared';
import { TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { refresh } from 'in-automation/AutomationCard/usePolicies';
import { TagsFilter } from 'in-automation/components/tableFilters';
import { close } from 'in-components/DialogPresenter/store';
import { ACTION_TYPE } from 'in-automation/constants';
import { saveBulkPolicies } from 'in-automation/api';
import { mapData } from 'in-services/util/result';
import Dialog from 'in-components/Dialog/Dialog';
import { Trans, t } from 'in-i18n';

const pathSegment = '/createPolicies';
const matrixPrefix = '';

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

function onCreate(
  policies: NewPolicy[],
  policyActionMapping: Map<string, ScoredAction>,
  createPolicyTrackerSegment: TrackingFunction,
  triggerName?: string
) {
  saveBulkPolicies(policies).once(
    () => {
      onCreateSuccess(policies.length);
      policies.forEach(policy => {
        const action = policyActionMapping.get(policy.name);
        createPolicyTrackerSegment({
          actionName: action!.name,
          actionType: action!.type,
          policyName: policy.name,
          policyType: 'manual',
          aiOriginated: isAIActionCopy(action!) ? true : false,
          triggerName: triggerName ?? ''
        });
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

function useActionFilters({
  actions,
  setServerTableUrlState
}: {
  actions: Result<ScoredAction[]>;
  setServerTableUrlState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [types, setTypesState] = useState<string[] | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);

  const filters = [
    {
      key: 'types' as const,
      value: types
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
          action.type !== ACTION_TYPE.EXTERNAL &&
          !isAIAction(action) &&
          filters.reduce((shouldInclude, filter) => {
            const emptyFilter = !filter.value?.length;
            if (emptyFilter) return shouldInclude;
            switch (filter.key) {
              case 'types':
                return shouldInclude && (filter.value?.some(type => action.type === type) ?? false);
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
    tags,
    setTags: (tags: string[]) => {
      setTags(tags);
      setServerTableUrlState({ page: 1, query: '' });
    }
  };
}

interface SelectActionsTableProps extends ServerTablePresenterProps<ScoredAction> {
  selectedIds: string[];
  onSelect: (action: ScoredAction) => void;
}

const selectActionColumn: ColumnDefinition<ScoredAction, SelectActionsTableProps> = {
  id: 'select',
  label: '',
  width: 5,
  getContent: (action, { selectedIds, onSelect }) => (
    <Checkbox
      label=""
      checked={selectedIds.includes(action.id)}
      onChange={e => {
        stopPropagationAndPreventDefault(e);
        onSelect(action);
      }}
    />
  )
};

const columnDefinitions: ColumnDefinition<ScoredAction, SelectActionsTableProps>[] = [
  selectActionColumn,
  actionNameColumn as ColumnDefinition<ScoredAction, SelectActionsTableProps>,
  descriptionColumn as ColumnDefinition<ScoredAction, SelectActionsTableProps>,
  tagsColumn as ColumnDefinition<ScoredAction, SelectActionsTableProps>,
  aiEngineColumn,
  scoreColumn
];

interface CreatePoliciesDialogProps {
  event: Event;
  actions: Result<ScoredAction[]>;
  trigger: Result<TriggerSpecification>;
}

export default function CreatePoliciesDialog({ event, actions, trigger }: CreatePoliciesDialogProps) {
  const { createPolicyTrackerSegment } = useSegmentTracker();
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

  const { filteredActions, types, setTypes, tags, setTags } = useActionFilters({ actions, setServerTableUrlState });

  const result = usePaginatedScoredActions({
    actions: filteredActions,
    serverTableUrlState,
    setServerTableUrlState
  });

  function onSubmit() {
    const selectedActions = selectedIds
      .map(id => actions.data!.find(action => id === action.id))
      .filter((action): action is ScoredAction => !!action);

    let policyActionMapping = new Map<string, ScoredAction>();
    const policies = selectedActions.map(action => {
      let policy = createBasePolicy(event, action);
      policyActionMapping.set(policy.name, action);
      return policy;
    });
    const triggerName = trigger.data?.name;

    onCreate(policies, policyActionMapping, createPolicyTrackerSegment, triggerName);
  }

  function onSelect(action: ScoredAction) {
    const updatedSelectedIds = selectedIds.includes(action.id)
      ? selectedIds.filter(id => id !== action.id)
      : [...selectedIds, action.id];
    setSelectedIds(updatedSelectedIds);
  }

  return (
    <Dialog title={t('in-automation:policies.createPolicies')} onClose={close} withoutBodyPadding>
      <LeftRightPadding>
        <ServerTablePresenter<ScoredAction, SelectActionsTableProps>
          selectedIds={selectedIds}
          onSelect={onSelect}
          leftHeader={<Typography variant="heading-300">{t('in-automation:actions')}</Typography>}
          searchPlaceholder={t('in-automation:searchActions')}
          onChange={setServerTableUrlState}
          page={page}
          onRowClick={(data, e) => {
            e.preventDefault();
            onSelect(data);
          }}
          searchMaxWidth={180}
          pageSize={pageSize}
          result={result}
          query={query}
          rightHeader={
            <>
              <Stack direction="horizontal">
                <TypeFilter type={types} setType={params => setTypes({ types: params.types })} showExternal />

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
