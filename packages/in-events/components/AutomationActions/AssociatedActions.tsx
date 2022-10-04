/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ActionTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import { getCustomEventActions, getBuiltinEventActions } from 'in-api/eventSpecifications';
import { Event, VolatileId } from 'in-types';

interface Props {
  event: Event;
  volatileId: VolatileId;
}
export default function AssociatedActions({ event, volatileId }: Props) {
  const eventSpecificationId: string = event?.metadata?.eventSpecificationId;
  const isCustom = isCustomEvent(event);
  const observable = isCustom ? getCustomEventActions : getBuiltinEventActions;
  return (
    <div>
      <ActionTable
        title="in-events:associatedActions"
        showExecuteColumn
        showActionLink
        event={event}
        volatileId={volatileId}
        loadEntities={() => observable(eventSpecificationId)}
      />
    </div>
  );
}

function isCustomEvent(event: Event): boolean {
  return event?.metadata?.custom_issue ?? false;
}
