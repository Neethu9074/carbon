/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React, { Fragment } from 'react';
import { filter } from 'lodash';

import { Observable } from '@instana/observables';
import { Spacer } from '@instana/components';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import ActionTable, { ActionTableProps } from 'in-automation/ActionCatalog/ActionTable';
import { getAllActionsWithAISuggestions } from 'in-automation/api';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { Action } from 'in-types';
import { t } from 'in-i18n';

type SetForm = React.Dispatch<React.SetStateAction<MapForm>>;
function actionSelectionTableActions(form: MapForm, setForm: SetForm) {
  return {
    deselect: {
      deselect: (deselectedEntity: Action) => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['actionIds'], field => {
              return (field as Field<string[]>)
                .setValue((field as Field<string[]>).value.filter(referencedId => referencedId !== deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function submitActionSelection(form: MapForm, setForm: SetForm, selectedIds: string[]) {
  setForm(
    form.updateIn(['actionIds'], field => {
      return (field as Field<string[]>).setValue((field as Field<string[]>).value.concat(selectedIds)).setTouched(true);
    })
  );
}

function getScoredActionTable(eventName: string, eventDescription: string) {
  return function ScoredActionTable(props: ActionTableProps) {
    return (
      <ActionTable {...props} loadEntities={() => getAllActionsWithAISuggestions(eventName, eventDescription)} scored />
    );
  };
}

interface ActionsSelectionProps {
  form: MapForm;
  setForm: SetForm;
  name?: string;
  description?: string;
}
export default function ActionsSelection({ form, setForm, name, description }: ActionsSelectionProps) {
  const selectedActions = (form.get('actionIds') as Field<string[]>)?.value ?? [];
  const eventName = name ?? (form.get('name') as Field<string>)?.value;
  const eventDescription = description ?? (form.get('description') as Field<string>)?.value;

  const getSelectedActionsForEvent = createMemoizedObservableForReferencedEntities(function(selectedActions: string[]) {
    if (selectedActions.length === 0) {
      return (alwaysEmptyArray as unknown) as Observable<Action[]>;
    }
    // null is treated as a pending result when converting the HTTP response into a result
    return getAllActionsWithAISuggestions(eventName, eventDescription).map(action =>
      filter(action, function(app) {
        return selectedActions.indexOf(app.id) >= 0;
      })
    );
  });

  const RightHeader = (
    <SelectListDialogButton
      form={form}
      onSubmit={(selectedIds: string[]) => submitActionSelection(form, setForm, selectedIds)}
      title={t('in-settings:tabs.addActions')}
      label={t('in-settings:tabs.addActions')}
      listComponent={getScoredActionTable(eventName, eventDescription)}
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
        loadEntities={() => getSelectedActionsForEvent(selectedActions)}
        noDataMessage={t('in-settings:tabs.noActionsSelected')}
        tableActions={actionSelectionTableActions(form, setForm)}
        pageSize={10}
        rightHeader={RightHeader}
        showActionLink
        scored
      />
      <TouchedMessages field={form.get('selectedActions')} />
      <Spacer vertical="large" />
    </Fragment>
  );
}
