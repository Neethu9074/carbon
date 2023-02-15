/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button, Spacer } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  getCustomEventActions,
  getBuiltinEventActions,
  getBuiltInEventSpecificationMutable,
  getCustomEventSpecificationMutable
} from 'in-api/eventSpecifications';
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import ActionAssociationDialogWrapper from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialogWrapper';
import ActionTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import { getScoredActionsForEvent, EventSpecification } from 'in-automation/api';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { Event, VolatileId, Action } from 'in-types';
import { t } from 'in-i18n';

interface AssociatedActionsCardProps {
  event: Event;
  volatileId: VolatileId;
}

export default function AssociatedActionsCard({ event, volatileId }: AssociatedActionsCardProps) {
  const eventSpecificationId: string = event?.metadata?.eventSpecificationId;
  const isCustom: boolean = event?.metadata?.custom_issue ?? false;
  const observable = isCustom ? getCustomEventActions : getBuiltinEventActions;
  const actions =
    useObservable<Action[], [string]>(() => observable(eventSpecificationId), [eventSpecificationId]) ?? [];

  const selectedActions: string[] = actions.map(action => action.id);
  const eventSpecification = useObservable<EventSpecification, [string]>(() => {
    if (!isCustom) {
      return getBuiltInEventSpecificationMutable(eventSpecificationId);
    } else {
      return getCustomEventSpecificationMutable(eventSpecificationId);
    }
  }, [eventSpecificationId]);

  if (!eventSpecification) {
    return <LoadingIndicator size="xl" />;
  }

  const getScoredActionsForEventMemoized = createMemoizedObservableForReferencedEntities(
    getScoredActionsForEvent(eventSpecification)
  );

  return (
    <div>
      <ActionTable
        title={t('in-events:associatedActions')}
        showExecuteColumn
        showActionLink
        event={event}
        rightHeader={<RightHeader eventSpecification={eventSpecification} actions={actions} isCustom={isCustom} />}
        volatileId={volatileId}
        loadEntities={() => getScoredActionsForEventMemoized(selectedActions)}
        scored
        isBeta
      />
    </div>
  );
}

interface RightHeaderProps {
  eventSpecification: EventSpecification;
  actions: Action[];
  isCustom: boolean;
}

const RightHeader = ({ eventSpecification, actions, isCustom }: RightHeaderProps) => {
  return (
    <>
      <Button
        kind="action"
        icon="lib_openclose_add_circle_outline"
        onClick={() => {
          addActiveDialog(
            <ActionAssociationDialogWrapper
              eventSpecification={eventSpecification}
              actions={actions}
              isCustom={isCustom}
              onClose={close}
            />
          );
        }}
      >
        {t('in-events:selectActions')}
      </Button>
      <Spacer horizontal="xsmall" />
    </>
  );
};
