/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { getAllActionsObservable, getAllActionsInternal } from 'in-automation/api';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { Action } from 'in-types';
import { t } from 'in-i18n';

interface ActionAssociationsViewerProps {
  actionIds: string[];
}
export default function AlertsActionAssociationsViewer({ actionIds }: ActionAssociationsViewerProps) {
  const allActions = useObservable(() => getAllActionsObservable(getAllActionsInternal).startWith(null), []);
  const getSelectedActionsForEvent = createMemoizedObservableForReferencedEntities(function (
    selectedActions: string[]
  ) {
    if (selectedActions.length === 0 || allActions === undefined || allActions?.progress?.loading) {
      return alwaysEmptyArray as unknown as Observable<Action[]>;
    }
    return just(allActions?.data?.filter((action: Action) => selectedActions.indexOf(action.id) >= 0) ?? []);
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
      />
    </>
  );
}
