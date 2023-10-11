/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useMemo, useState } from 'react';

import { Message } from '@instana/components';

import { updateCustomEventActionAssociations, updateBuiltinEventActionAssociations } from 'in-automation/api';
import { getEventSpecificationId, getIsCustomEvent, useAssociatedActionsData } from './shared';
import { EventSpecification, getAllActionsWithAISuggestions } from 'in-automation/api';
import NotificationComponent from 'in-components/form/Notification/Notification';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { associateActionsTracker } from 'in-automation/tracker';
import { Event, VolatileId, Action } from 'in-types';
import { t } from 'in-i18n';

interface SuggestedActionsCardProps {
  event: Event;
  volatileId: VolatileId;
  reload: number;
  setReload: (r: number) => void;
}

export default function RecommendedActionsCard({ event, volatileId, reload, setReload }: SuggestedActionsCardProps) {
  const [error, setError] = useState(false);
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);

  const { actions: existingActions, eventSpecification } = useAssociatedActionsData(
    eventSpecificationId,
    isCustomEvent,
    reload
  );
  const triggerReload = () => setReload(Math.random());
  let actionError = null;

  // Memoize the creation of selectedActionsSet
  const selectedActionsSet = useMemo(() => {
    if (existingActions && Array.isArray(existingActions)) {
      return new Set((existingActions ?? []).map(action => action.id));
    }
    return new Set();
  }, [existingActions]);

  if (existingActions && 'message' in existingActions) {
    actionError = existingActions.message;
  }

  const getUnusedSuggestedActions = useMemo(() => {
    if (!eventSpecification) return null;
    return getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '').map(
      allActions => {
        if (!existingActions) return [];
        return allActions
          .filter(action => action.confidence != 'low' && !selectedActionsSet.has(action.id))
          .slice(0, 5)
          .sort((a, b) => b.score - a.score);
      }
    );
  }, [eventSpecification, existingActions, selectedActionsSet]);

  if (!eventSpecification || !getUnusedSuggestedActions || !existingActions) {
    return <LoadingIndicator size="xl" />;
  }

  return (
    <>
      {error && <NotificationComponent failure>{t('in-automation:failedToSaveAssocation')}</NotificationComponent>}
      {actionError && (
        <Message type="error" small withIcon>
          {actionError}
        </Message>
      )}
      <ActionTable
        noDataMessage={t('in-automation:noRecommendedActionsAvailable')}
        showActionLink
        title={t('in-automation:recommendedActions')}
        isBeta
        event={event}
        volatileId={volatileId}
        pageSize={5}
        isSearchable={false}
        loadEntities={() => getUnusedSuggestedActions}
        scored
        rightHeader={<></>} // required to get the title of the card to show with the beta badge
        tableActions={{
          select: {
            title: action => t('in-automation:associateActionWithName', { actionName: action.name }),
            select: selectedAction =>
              associateAction({
                action: selectedAction,
                existingActions,
                event: eventSpecification,
                triggerReload,
                setError,
                isCustomEvent
              })
          }
        }}
      />
    </>
  );
}
interface AssociateActionProps {
  action: Action;
  existingActions: Action[] | { code: string; message: string };
  event: EventSpecification;
  triggerReload: () => void;
  setError: (e: boolean) => void;
  isCustomEvent: boolean;
}

function associateAction({
  action,
  event,
  triggerReload,
  setError,
  isCustomEvent,
  existingActions
}: AssociateActionProps) {
  associateActionsTracker({
    eventName: event.name,
    actionNames: [action.name]
  });

  const onSave = () => triggerReload();
  const handleErrors = () => setError(true);
  const updatedActions = 'message' in existingActions ? [action] : [...existingActions, action];

  const updateActionAssociations = isCustomEvent
    ? updateCustomEventActionAssociations
    : updateBuiltinEventActionAssociations;

  updateActionAssociations(
    updatedActions.map(({ id }) => id),
    event.id
  ).once(onSave, handleErrors);
}
