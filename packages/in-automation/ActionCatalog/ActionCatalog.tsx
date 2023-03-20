/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { actionDetailsNewPath } from 'in-automation/navigation/paths';
import { createNewEntityButton } from 'in-settings/components/List';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { deleteAction, getAllActions } from 'in-automation/api';
import { deleteActionTracker } from 'in-settings/tracker';
import { Action } from 'in-types';
import { t } from 'in-i18n';

const tableActions = {
  delete: {
    deleteEntity: (action: Action) => {
      deleteActionTracker({ actionName: action.name, actionType: action.type });
      return deleteAction(action.id);
    }
  }
};
export default function ActionCatalog() {
  return (
    <ActionTable
      title={t('in-settings:tabs.actionCatalog')}
      noDataMessage={t('in-settings:tabs.noActions')}
      getEntityName={(action: Action) => t('in-settings:tabs.actionWithNameForDelete', { actionName: action.name })}
      tableActions={tableActions}
      rightHeader={rightHeader()}
      loadEntities={getAllActions}
      showActionLink
      showTestColumn
      showDuplicateColumn
      isBeta
    />
  );
}

function rightHeader() {
  return createNewEntityButton({
    labelNew: t('in-settings:tabs.newAction'),
    pathNew: actionDetailsNewPath
  });
}
