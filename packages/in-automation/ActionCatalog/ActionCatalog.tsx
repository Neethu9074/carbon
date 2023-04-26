/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import AutomationTabs from 'in-automation/AutomationTabs/AutomationTabs';
import { actionDetailsNewPath } from 'in-automation/navigation/paths';
import { createNewEntityButton } from 'in-settings/components/List';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { deleteAction, getAllActions } from 'in-automation/api';
import { deleteActionTracker } from 'in-automation/tracker';
import { role } from 'in-stores/user';
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
export default function ActionCatalogTab() {
  return (
    <AutomationTabs>
      <ActionTable
        title={t('in-automation:ActionCatalog.actionCatalog')}
        noDataMessage={t('in-automation:ActionCatalog.noActions')}
        getEntityName={(action: Action) =>
          t('in-automation:ActionCatalog.actionWithNameForDelete', { actionName: action.name })
        }
        tableActions={tableActions}
        rightHeader={rightHeader()}
        loadEntities={getAllActions}
        showActionLink
        showTestColumn={role?.canRunAutomationActions}
        showDuplicateColumn
        isBeta
      />
    </AutomationTabs>
  );
}

function rightHeader() {
  return createNewEntityButton({
    labelNew: t('in-automation:ActionCatalog.newAction'),
    pathNew: actionDetailsNewPath
  });
}
