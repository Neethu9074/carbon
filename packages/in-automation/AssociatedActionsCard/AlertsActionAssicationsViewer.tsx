/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { filter } from 'lodash';
import React from 'react';

import { Observable } from '@instana/observables';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { getAllActionsWithAISuggestions } from 'in-automation/api';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { Action } from 'in-types';
import { t } from 'in-i18n';

interface ActionAssociationsViewerProps {
  actionIds: string[];
  alertName: string;
  alertDescription: string;
}
export default function AlertsActionAssociationsViewer({
  actionIds,
  alertName,
  alertDescription
}: ActionAssociationsViewerProps) {
  const getSelectedActionsForEvent = createMemoizedObservableForReferencedEntities(function (
    selectedActions: string[]
  ) {
    if (selectedActions.length === 0) {
      return alwaysEmptyArray as unknown as Observable<Action[]>;
    }
    // null is treated as a pending result when converting the HTTP response into a result
    return getAllActionsWithAISuggestions(alertName, alertDescription).map(action =>
      filter(action, function (app) {
        return selectedActions.indexOf(app.id) >= 0;
      })
    );
  });

  return (
    <>
      <ActionTable
        loadEntities={() => getSelectedActionsForEvent(actionIds)}
        noDataMessage={t('in-settings:tabs.noActionsSelected')}
        pageSize={10}
        showActionLink
        showExecuteColumn={false}
        isBeta={false}
        isSearchable={false}
        scored
      />
    </>
  );
}
