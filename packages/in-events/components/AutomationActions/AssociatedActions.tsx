/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import ActionAssociationDialogWrapper from 'in-events/components/AutomationActions/action_associations_dialog/ActionAssociationDialogWrapper';
import ActionTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';
import { getCustomEventActions, getBuiltinEventActions } from 'in-api/eventSpecifications';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
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

  return (
    <div>
      <ActionTable
        title={t('in-events:associatedActions')}
        showExecuteColumn
        showActionLink
        event={event}
        rightHeader={<RightHeader event={event} actions={actions} isCustom={isCustom} />}
        volatileId={volatileId}
        loadEntities={() => observable(eventSpecificationId)}
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
