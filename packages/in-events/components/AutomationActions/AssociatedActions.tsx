/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { filter } from 'lodash';
import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import ActionAssociationDialogWrapper from 'in-events/components/AutomationActions/action_associations_dialog/ActionAssociationDialogWrapper';
import ActionTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import { getCustomEventActions, getBuiltinEventActions } from 'in-api/eventSpecifications';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getAllActionsWithAISuggestions } from 'in-api/automation';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { Event, VolatileId, Action } from 'in-types';
import { t } from 'in-i18n';

interface Props {
  event: Event;
  volatileId: VolatileId;
}

interface RightHeaderProps {
  event: Event;
  actions: Action[];
  isCustom: boolean;
}

export default function AssociatedActions({ event, volatileId }: Props) {
  const eventSpecificationId: string = event?.metadata?.eventSpecificationId;
  const isCustom = isCustomEvent(event);
  const observable = isCustom ? getCustomEventActions : getBuiltinEventActions;
  const actions =
    useObservable<Action[], [string]>(() => observable(eventSpecificationId), [eventSpecificationId]) ?? [];
  const selectedActions: string[] = actions.map(action => action.id);
  const eventName: string | undefined = event?.problem?.problemText;
  const eventDescription: string | undefined = event?.problem?.fixSuggestion;

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

  return (
    <div>
      <ActionTable
        title={t('in-events:associatedActions')}
        showExecuteColumn
        showActionLink
        event={event}
        rightHeader={<RightHeader event={event} actions={actions} isCustom={isCustom} />}
        volatileId={volatileId}
        loadEntities={() => getSelectedActionsForEvent(selectedActions)}
        scored
      />
    </div>
  );
}

export const RightHeader = (props: RightHeaderProps) => {
  const { event, actions, isCustom } = props;
  return (
    <Button
      kind="action"
      icon="lib_openclose_add_circle_outline"
      onClick={() => {
        addActiveDialog(
          <ActionAssociationDialogWrapper event={event} actions={actions} isCustom={isCustom} onClose={close} />
        );
      }}
    >
      {t('in-events:selectActions')}
    </Button>
  );
};

function isCustomEvent(event: Event): boolean {
  return event?.metadata?.custom_issue ?? false;
}
