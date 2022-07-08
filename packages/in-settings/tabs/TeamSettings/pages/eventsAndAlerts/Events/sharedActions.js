/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';
import { filter } from 'lodash';

import { Spacer } from '@instana/components';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import AssociatedActions from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionCatalog';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { getAllActions } from 'in-api/automation';
import { t } from 'in-i18n';

function ActionSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['actionIds'], field => {
              return field
                .setValue(field.value.filter(referencedId => referencedId !== deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function submitActionSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['actionIds'], field => {
      return field.setValue(field.value.concat(selectedIds)).setTouched(true);
    })
  );
}

const getSelectedActionsForEvent = createMemoizedObservableForReferencedEntities(function(selectedActions) {
  if (selectedActions.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAllActions().map(action =>
    filter(action, function(app) {
      return selectedActions.indexOf(app.id) >= 0;
    })
  );
});

export function ActionsSelection({ form, setForm }) {
  let selectedActions = form.get('actionIds') ? form.get('actionIds').value : [];

  return (
    <Fragment>
      <AssociatedActions
        setTitle
        loadEntities={() => getSelectedActionsForEvent(selectedActions)}
        hasRowNavigation={false}
        emptyMessage={t('in-settings:tabs.noActionsSelected')}
        tableActions={ActionSelectionTableActions(form, setForm)}
        pageSize={10}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitActionSelection(form, setForm, selectedIds)}
            title={t('in-settings:tabs.addActions')}
            label={t('in-settings:tabs.addActions')}
            listComponent={AssociatedActions}
            limit={10}
            hiddenIds={selectedActions}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0
                ? t('in-settings:tabs.addNumberOfItemsAction', { count: numberOfItems })
                : t('in-settings:tabs.addActions')
            }
            requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
          />
        }
      />
      <TouchedMessages field={form.get('selectedActions')} />
      <Spacer vertical="large" />
    </Fragment>
  );
}
