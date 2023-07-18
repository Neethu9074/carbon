/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  getCustomEventSpecificationMutable,
  saveCustomEventSpecificationWithActions,
  updateActionsAssignedToBuiltInEvent
} from 'in-api/eventSpecifications';
import { getAllActionsWithAISuggestions, getApplicationAlertActionAssociations } from 'in-automation/api';
import { Event, VolatileId, Action, ApplicationAlertConfigWithMetadata } from 'in-types';
import NotificationComponent from 'in-components/form/Notification/Notification';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { associateActionsTracker } from 'in-automation/tracker';
import { t } from 'in-i18n';

interface RecommendedActionsCardAlertsProps {
  event: Event;
  volatileId: VolatileId;
  reload: number;
  setReload: (r: number) => void;
  alertConfig?: ApplicationAlertConfigWithMetadata;
}

const getIsCustomEvent = (event: RecommendedActionsCardAlertsProps['event']) =>
  (event?.metadata?.custom_issue as boolean) ?? false;
const getEventSpecificationId = (event: RecommendedActionsCardAlertsProps['event']) =>
  event?.metadata?.eventSpecificationId as string;

export default function RecommendedActionsCardAlerts({
  event,
  volatileId,
  reload,
  setReload,
  alertConfig
}: RecommendedActionsCardAlertsProps) {
  const [error, setError] = useState(false);
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);

  const existingActions =
    useObservable(() => getApplicationAlertActionAssociations(eventSpecificationId), [eventSpecificationId, reload]) ??
    null;

  const triggerReload = () => setReload(Math.random());

  const getUnusedSuggestedActions = useMemo(() => {
    if (!alertConfig) return null;

    const selectedActionsSet = new Set((existingActions ?? []).map(action => action.id));

    return getAllActionsWithAISuggestions(alertConfig.name, alertConfig.description ?? '').map(allActions => {
      if (!existingActions) return [];
      return allActions
        .filter(action => action.color != 'low' && !selectedActionsSet.has(action.id))
        .slice(0, 5)
        .sort((a, b) => b.score - a.score);
    });
  }, [alertConfig, existingActions]);

  if (!alertConfig || !getUnusedSuggestedActions || !existingActions) {
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
                alertConfig,
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
  alertConfig: ApplicationAlertConfigWithMetadata;
  triggerReload: () => void;
  setError: (e: boolean) => void;
  isCustomEvent: boolean;
}

export function associateAction({
  action,
  alertConfig,
  triggerReload,
  setError,
  isCustomEvent,
  existingActions
}: AssociateActionProps) {
  associateActionsTracker({
    eventName: alertConfig.name,
    actionNames: [action.name]
  });

  const onSave = () => triggerReload();
  const handleErrors = () => setError(true);
  const updatedActions = [...existingActions, action];

  if (isCustomEvent) {
    getCustomEventSpecificationMutable(alertConfig.id).once(
      response =>
        saveCustomEventSpecificationWithActions({ ...response, actions: updatedActions }).once(onSave, handleErrors),
      handleErrors
    );
    return;
  }

  updateActionsAssignedToBuiltInEvent(updatedActions, alertConfig.id).once(onSave, handleErrors);
}
