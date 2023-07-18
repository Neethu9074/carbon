/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  getCustomEventActions,
  getBuiltinEventActions,
  getBuiltInEventSpecificationMutable,
  getCustomEventSpecificationMutable,
  saveCustomEventSpecificationWithActions,
  updateActionsAssignedToBuiltInEvent
} from 'in-api/eventSpecifications';
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

function getObservables(isCustomEvent: boolean) {
  return {
    getEventSpecification: isCustomEvent ? getCustomEventSpecificationMutable : getBuiltInEventSpecificationMutable,
    getActionsForEventSpecification: isCustomEvent ? getCustomEventActions : getBuiltinEventActions
  };
}

function useAssociatedActionsData(eventSpecificationId: string, isCustomEvent: boolean, reload: number) {
  const { getEventSpecification, getActionsForEventSpecification } = getObservables(isCustomEvent);

  const actions =
    useObservable<Action[], [string, number]>(
      () => getActionsForEventSpecification(eventSpecificationId),
      [eventSpecificationId, reload]
    ) ?? null; // fallback to null instead of an empty array so we can recognize the loading state

  const eventSpecification = useObservable<EventSpecification, [string]>(
    () => getEventSpecification(eventSpecificationId),
    [eventSpecificationId]
  );
  return { actions, eventSpecification };
}

const getIsCustomEvent = (event: SuggestedActionsCardProps['event']) =>
  (event?.metadata?.custom_issue as boolean) ?? false;
const getEventSpecificationId = (event: SuggestedActionsCardProps['event']) =>
  event?.metadata?.eventSpecificationId as string;

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

  const getUnusedSuggestedActions = useMemo(() => {
    if (!eventSpecification) return null;

    const selectedActionsSet = new Set((existingActions ?? []).map(action => action.id));

    return getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '').map(
      allActions => {
        if (!existingActions) return [];
        return allActions
          .filter(action => action.color != 'low' && !selectedActionsSet.has(action.id))
          .slice(0, 5)
          .sort((a, b) => b.score - a.score);
      }
    );
  }, [eventSpecification, existingActions]);

  if (!eventSpecification || !getUnusedSuggestedActions || !existingActions) {
    return <LoadingIndicator size="xl" />;
  }

  return (
    <>
      {error && <NotificationComponent failure>{t('in-automation:failedToSaveAssocation')}</NotificationComponent>}
      <ActionTable
        noDataMessage={t('in-automation:noRecommendedActionsAvailable')}
        showActionLink
        event={event}
        volatileId={volatileId}
        pageSize={5}
        isSearchable={false}
        loadEntities={() => getUnusedSuggestedActions}
        scored
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
  existingActions: Action[];
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
  const updatedActions = [...existingActions, action];

  if (isCustomEvent) {
    getCustomEventSpecificationMutable(event.id).once(
      response =>
        saveCustomEventSpecificationWithActions({ ...response, actions: updatedActions }).once(onSave, handleErrors),
      handleErrors
    );
    return;
  }

  updateActionsAssignedToBuiltInEvent(updatedActions, event.id).once(onSave, handleErrors);
}
