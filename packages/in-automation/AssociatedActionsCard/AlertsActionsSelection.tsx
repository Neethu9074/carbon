/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React, { Fragment } from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Spacer } from '@instana/components';
import { just } from '@instana/observables';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import {
  getAllActionsObservable,
  ScoredAction,
  getAllActionsInternal,
  getAllActionsWithAISuggestionsInternal
} from 'in-automation/api';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import ActionTable, { ActionTableProps } from 'in-automation/ActionCatalog/ActionTable';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { Action, Result } from 'in-types';
import { t } from 'in-i18n';

function actionSelectionTableActions(
  form: MapForm<any>,
  onChange: (path: string[], updater: (item: Field<string[]>) => Field<string[]>) => void
) {
  return {
    deselect: {
      deselect: (deselectedEntity: Action) => {
        if (deselectedEntity) {
          const value = (form.get('actionIds') as Field<string[]>).value.filter(
            referencedId => referencedId !== deselectedEntity.id
          );
          onChange(['actionIds'], (field: Field<string[]>) => field.setValue(value).setTouched(true));
        }
      }
    }
  };
}

function submitActionSelection(
  form: MapForm<any>,
  onChange: (path: string[], updater: (item: Field<string[]>) => Field<string[]>) => void,
  selectedIds: string[]
) {
  const currentActionIds = form.get('actionIds').value ?? [];
  onChange(['actionIds'], (field: Field<string[]>) =>
    field.setValue(currentActionIds.concat(selectedIds)).setTouched(true)
  );
}

const convertedData = (data: ScoredAction[] | undefined) =>
  data?.map((item: any) => {
    return { ...item.action, color: item.color, score: item.score };
  });

interface ActionsSelectionProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Field<string[]>) => Field<string[]>) => void;
  name?: string;
  description?: string;
  pageSize?: number;
}
export default function AlertsActionsSelection({ form, name, description, pageSize, onChange }: ActionsSelectionProps) {
  const selectedActions = (form.get('actionIds') as Field<string[]>)?.value ?? [];
  const eventName = name ?? (form.get('name') as Field<string>).value;
  const eventDescription = description ?? (form.get('description') as Field<string>).value;

  const allActions = useObservable(() => getAllActionsObservable(getAllActionsInternal).startWith(null), []);

  const allActionsWithAI = getAllActionsWithAISuggestionsInternal({ eventName, eventDescription })
    .map((result: Result<ScoredAction[]>) => {
      if (result == null || result === undefined || result.data === undefined || result?.progress?.loading) {
        return [] as ScoredAction[];
      }
      return convertedData((result as Result<ScoredAction[]>)?.data);
    })
    .map(result => result ?? ([] as ScoredAction[]));
  function getScoredActionTable() {
    return function ScoredActionTable(props: ActionTableProps) {
      return <ActionTable {...props} loadEntities={() => allActionsWithAI} scored />;
    };
  }

  const getSelectedActionsForEvent = createMemoizedObservableForReferencedEntities(function (
    selectedActions: string[]
  ) {
    if (selectedActions.length === 0 || allActions === undefined || allActions?.progress?.loading) {
      return alwaysEmptyArray as unknown as Observable<Action[]>;
    }
    return just(allActions?.data?.filter((action: Action) => selectedActions.indexOf(action.id) >= 0) ?? []);
  });

  const RightHeader = (
    <SelectListDialogButton
      form={form}
      onSubmit={(selectedIds: string[]) => submitActionSelection(form, onChange, selectedIds)}
      title={t('in-settings:tabs.addActions')}
      label={t('in-settings:tabs.addActions')}
      listComponent={getScoredActionTable()}
      hiddenIds={selectedActions}
      createSubmitLabel={(numberOfItems: number) =>
        numberOfItems > 0
          ? t('in-settings:tabs.addNumberOfItemsAction', { count: numberOfItems })
          : t('in-settings:tabs.addActions')
      }
      requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
    />
  );

  return (
    <Fragment>
      <ActionTable
        loadEntities={() => getSelectedActionsForEvent((form.get('actionIds') as Field<string[]>).value)}
        noDataMessage={t('in-settings:tabs.noActionsSelected')}
        tableActions={actionSelectionTableActions(form, onChange)}
        pageSize={pageSize ?? 10}
        rightHeader={RightHeader}
        showActionLink
      />
      <TouchedMessages field={form.get('selectedActions')} />
      <Spacer vertical="large" />
    </Fragment>
  );
}
