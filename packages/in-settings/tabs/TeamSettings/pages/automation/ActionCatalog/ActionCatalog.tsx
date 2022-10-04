/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ActionTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import { teamSettingsActionDetailsNew } from 'in-settings/navigation/paths';
import { createNewEntityButton } from 'in-settings/components/List';
import { deleteAction, getAllActions } from 'in-api/automation';
import { Action } from 'in-types';
import { t } from 'in-i18n';

const tableActions = {
  delete: {
    deleteEntity: (action: Action) => deleteAction(action.id)
  }
};
export default function ActionCatalog() {
  return (
    <ActionTable
      title={'in-settings:tabs.actionCatalog'}
      noDataMessage={t('in-settings:tabs.noActions')}
      getEntityName={(action: Action) => t('in-settings:tabs.actionWithNameForDelete', { actionName: action.name })}
      tableActions={tableActions}
      rightHeader={rightHeader()}
      loadEntities={getAllActions}
      showActionLink
    />
  );
}

function rightHeader() {
  return createNewEntityButton({
    labelNew: t('in-settings:tabs.newAction'),
    pathNew: teamSettingsActionDetailsNew
  });
}
