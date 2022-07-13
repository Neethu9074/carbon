/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Map } from 'immutable';
import React from 'react';

// @ts-expect-error
import { getActionAssociationCustom, getActionAssociationBuiltin } from 'in-api/eventSpecifications';
// @ts-expect-error
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import ActionTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import { t } from 'in-i18n';

export default function AssociatedActions({ event }: { event: Map<string, any> }) {
  const eventSpecificationId = event.getIn(['metadata', 'eventSpecificationId']);
  const isCustom = isCustomEvent(event);
  const observable = isCustom ? getActionAssociationCustom : getActionAssociationBuiltin;
  return (
    <div>
      <EventSpecificationLink event={event} buttonText={t('in-events:setAssociations')} />
      <ActionTable
        showExecuteColumn
        loadEntities={() => observable(eventSpecificationId).map((response: any) => response.toJS())}
      />
    </div>
  );
}

function isCustomEvent(event: Map<string, any>) {
  return event.getIn(['metadata', 'custom_issue'], false);
}
