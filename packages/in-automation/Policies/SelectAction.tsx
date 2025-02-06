/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Spacer, Stack, IconButton, Button, RadioButton } from '@instana/components';
import { Action } from '@instana/types';

import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { descriptionColumn, nameColumn } from 'in-automation/ActionTable/columnDefinitions';
import { usePolicyFormContext } from 'in-automation/Policies/usePolicyForm/usePolicyForm';
import FormFooter, { CancelButton } from 'in-components/form/FormFooter/FormFooter';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { getPolicyFromForm } from 'in-automation/Policies/usePolicyForm/utils';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { PolicyForm } from 'in-automation/Policies/usePolicyForm/types';
import { TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { TagsFilter } from 'in-automation/components/tableFilters';
import { listSuccess, success } from 'in-services/util/result';
import { EXECUTABLE_ACTIONS } from 'in-automation/constants';
import FormGroup from 'in-components/form/FormGroup';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Label from 'in-components/form/Label/Label';
import Dialog from 'in-components/Dialog/Dialog';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Policy.mless';

export default function SelectAction({ actions }: { actions: Action[] }) {
  const { form, setForm } = usePolicyFormContext();

  const action = form.get('action');
  const actionId = action.get('actionId');

  const selectedAction = actions.find(action => action.id === actionId.value);
  const result = listSuccess(selectedAction ? [selectedAction] : []);

  const columnDefinitions: ColumnDefinition<Action>[] = [
    nameColumn,
    descriptionColumn,
    tagsColumn as ColumnDefinition<Action>
  ];
  const isExecutableAction = selectedAction ? EXECUTABLE_ACTIONS.includes(selectedAction.type) : false;
  if (isExecutableAction && role?.canConfigureAutomationPolicies) {
    columnDefinitions.push({
      id: 'configure',
      label: '',
      width: 8,
      getContent: item => (
        <Tooltip content={t('in-automation:policies.configure')} delay={500}>
          <IconButton
            onClick={() =>
              addActiveDialog(
                <RunActionDialog
                  handleSave={(params, volatileId) => {
                    setForm(form =>
                      form
                        .updateIn(['action', 'parameters'], item => item.setValue(params).setTouched(true))
                        .updateIn(['action', 'agentId'], item => item.setValue(volatileId.host_id!).setTouched(true))
                    );
                    close();
                  }}
                  policy={getPolicyFromForm(form)}
                  action={item}
                  volatileId={{}}
                />
              )
            }
            buttonType="button"
            kind="primaryv2"
            type="lib_actions_edit"
          />
        </Tooltip>
      )
    });
  }

  return (
    <FormGroup>
      <ServerTablePresenter
        leftHeader={<Label hasError={!action.valid && action.touched}>{t('in-automation:policies.action')}</Label>}
        pageSize={1}
        page={0}
        isSearchable={false}
        noDataMessage={t('in-automation:policies.noActionConfigured')}
        orderBy="id"
        orderDirection="ASC"
        columnDefinitions={columnDefinitions}
        result={result}
        rightHeader={
          role?.canConfigureAutomationPolicies && (
            <Button
              kind="action"
              onClick={() => addActiveDialog(<SelectActionDialog setForm={setForm} actions={actions} form={form} />)}
              icon="lib_openclose_add_circle_outline"
            >
              {t('in-automation:policies.addAction')}
            </Button>
          )
        }
        fixedLayout
      />
      {action.touched && <TouchedMessages field={action} className={locals.subErrorTextFormField} />}
    </FormGroup>
  );
}

function SelectActionDialog({
  actions,
  form,
  setForm
}: {
  actions: Action[];
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
}) {
  const selectedActionId = form.getIn(['action', 'actionId']).value;
  const [selectedId, setSelectedId] = useState(selectedActionId);

  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment: '/action',
    matrixPrefix: '',
    defaultOrderBy: 'name',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;
  const actionTags = [...new Set(actions.flatMap(action => action.tags ?? []))];
  const { filteredActions, types, setTypes, tags, setTags } = useActionFilters({ actions, setServerTableUrlState });
  const result = usePaginatedResult({
    result: success(filteredActions),
    serverTableUrlState,
    setServerTableUrlState,
    searchAttributes: ['name', 'description', 'type', action => action?.tags?.toString() ?? ''],
    sort: [
      entity => selectedId !== entity.id,
      entity => {
        const value = entity[orderBy as keyof Action];
        return typeof value === 'string' ? value.trim().toLowerCase() : value;
      }
    ]
  });

  function handleSubmit() {
    setForm(form => form.updateIn(['action', 'actionId'], item => item.setValue(selectedId).setTouched(true)));
    close();
  }

  function onChange(item: Action) {
    setSelectedId(item.id);
    setServerTableUrlState({ page: 1, query: '' });
  }

  const columnDefinitions: ColumnDefinition<Action>[] = [
    {
      id: 'select',
      label: '',
      width: 50,
      getContent: item => <RadioButton label="" checked={item.id === selectedId} onChange={() => onChange(item)} />
    },
    nameColumn,
    descriptionColumn,
    tagsColumn as ColumnDefinition<Action>
  ];

  return (
    <Dialog className={locals.select} title={t('in-automation:policies.addAction')} onClose={close} withoutBodyPadding>
      <div className={locals.selectDialog}>
        <ServerTablePresenter<Action, ServerTablePresenterProps<Action>>
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
                <TypeFilter type={types} setType={params => setTypes({ types: params.types })} />
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
      </div>
      <Spacer vertical="small" />
      <FormFooter>
        <CancelButton onClick={close} />
        <Button kind="primary" disabled={!selectedId} onClick={handleSubmit}>
          {t('in-automation:policies.addAction')}
        </Button>
      </FormFooter>
    </Dialog>
  );
}

function useActionFilters({
  actions,
  setServerTableUrlState
}: {
  actions: Action[];
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

  const filteredActions = actions.filter(action => {
    // Filter OOTB wastsonx actions
    if (action.metadata?.builtIn && action.metadata?.ai !== null) {
      return false;
    }

    let shouldInclude = true;
    filters.forEach(filter => {
      const nonEmptyFilter = filter.value?.length;
      if (filter.key === 'types' && nonEmptyFilter) {
        shouldInclude = shouldInclude && (filter.value?.some(type => action.type === type) ?? false);
      } else if (filter.key === 'tags' && nonEmptyFilter) {
        shouldInclude = shouldInclude && (action.tags?.some(tag => filter.value.includes(tag)) ?? false);
      }
    });

    return shouldInclude;
  });

  return {
    filteredActions,
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
