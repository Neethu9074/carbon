/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { just } from '@instana/observables';

import { deleteAction, getAllActions, createBuiltInActions } from 'in-automation/api';
import AutomationTabs from 'in-automation/AutomationTabs/AutomationTabs';
import { actionDetailsNewPath } from 'in-automation/navigation/paths';
import { CreateNewEntityButton } from 'in-settings/components/List';
import { isNotEditable } from 'in-automation/ActionCatalog/shared';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { deleteActionTracker } from 'in-automation/tracker';
import { role } from 'in-stores/user';
import { Action } from 'in-types';
import { t } from 'in-i18n';

const tableActions = {
  delete: {
    deleteEntity: (action: Action) => {
      deleteActionTracker({ actionName: action.name, actionType: action.type });
      return deleteAction(action.id);
    },
    deleteProtection: (action: Action) => isNotEditable(action, false)
  }
};

const checkForBuiltInActions = () => {
  return getAllActions().flatMap(actions => {
    if (actions.filter(action => action?.metadata?.builtIn).length === 0) {
      return createBuiltInActions().flatMap(() => getAllActions());
    }
    return just(actions);
  });
};

export default function ActionCatalogTab() {
  return (
    <AutomationTabs>
      <p>Hello there General Kenobi</p>
      <ActionTable
        title={t('in-automation:ActionCatalog.actionCatalog')}
        noDataMessage={t('in-automation:ActionCatalog.noActions')}
        getEntityName={action => t('in-automation:ActionCatalog.actionWithNameForDelete', { actionName: action.name })}
        tableActions={tableActions}
        rightHeader={
          <CreateNewEntityButton labelNew={t('in-automation:ActionCatalog.newAction')} pathNew={actionDetailsNewPath} />
        }
        loadEntities={checkForBuiltInActions}
        showActionLink
        showTestColumn={role?.canRunAutomationActions}
        showDuplicateColumn
        isBeta
      />
    </AutomationTabs>
  );
}
