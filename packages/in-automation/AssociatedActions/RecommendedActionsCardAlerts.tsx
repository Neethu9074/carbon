/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import {
  getAllActionsWithAISuggestions,
  getApplicationAlertActionAssociations,
  updateApplicationAlertActionAssociations
} from 'in-automation/api';
import RecommendationActionsTable from 'in-automation/AssociatedActions/RecommendationActionsTable';
import { Event, Action, ApplicationAlertConfigWithMetadata, Result, VolatileId } from 'in-types';
import NotificationComponent from 'in-components/form/Notification/Notification';
import { getEventSpecificationId, getIsCustomEvent } from './shared';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { associateActionsTracker } from 'in-automation/tracker';
import { t } from 'in-i18n';

interface RecommendedActionsCardAlertsProps {
  event: Event;
  reload: number;
  setReload: (r: number) => void;
  alertConfig: ApplicationAlertConfigWithMetadata;
  setSelectedType: (str: string) => void;
  volatileId: VolatileId;
}

export default function RecommendedActionsCardAlerts({
  event,
  reload,
  setReload,
  alertConfig,
  setSelectedType,
  volatileId
}: RecommendedActionsCardAlertsProps) {
  const [error, setError] = useState(false);

  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);
  const entityId = event?.entityId ?? '';
  const existingActions =
    useObservable<Action[] | { code: string; message: string }, [string, number]>(
      () => getApplicationAlertActionAssociations(eventSpecificationId),
      [eventSpecificationId, reload]
    ) ?? null;

  const triggerReload = () => setReload(Math.random());
  // Memoize the creation of selectedActionsSet
  const selectedActionsSet = useMemo(() => {
    if (existingActions && Array.isArray(existingActions)) {
      return (existingActions ?? []).map(action => action.id);
    }
    return [];
  }, [existingActions]);
  let actionError = null;

  if (existingActions && 'message' in existingActions) {
    actionError = existingActions.message;
  }

  function getUnusedSuggestedActions() {
    return getAllActionsWithAISuggestions(alertConfig?.name, alertConfig?.description ?? '', entityId).map(
      allActions => {
        return allActions
          .filter(action => action.confidence != 'low' && !selectedActionsSet.includes(action.id))
          .sort((a, b) => b.score - a.score);
      }
    );
  }
  const unusedSuggestedActions = useObservable(getUnusedSuggestedActions, [alertConfig, selectedActionsSet, reload]);

  if (!alertConfig || !unusedSuggestedActions || !existingActions) {
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
      {actionError === null && Array.isArray(existingActions) && (
        <RecommendationActionsTable
          unusedSuggestedActions={unusedSuggestedActions}
          existingActions={existingActions}
          eventSpecification={alertConfig}
          triggerReload={triggerReload}
          setError={setError}
          isCustomEvent={isCustomEvent}
          setSelectedType={setSelectedType}
          isApplicationSmartAlert
          volatileId={volatileId}
          event={event}
        />
      )}
    </>
  );
}

interface AssociateActionProps {
  action: Action;
  existingActions: Result<Action[]>;
  alertConfig: ApplicationAlertConfigWithMetadata;
  triggerReload: () => void;
  setError: (e: boolean) => void;
  isCustomEvent: boolean;
  setSelectedType: (str: string) => void;
}

export function associateAction({
  action,
  alertConfig,
  triggerReload,
  setError,
  existingActions,
  setSelectedType
}: AssociateActionProps) {
  associateActionsTracker({
    eventName: alertConfig.name,
    actionNames: [action.name]
  });

  const selectedActionsSet = new Set(existingActions?.data ?? []);
  const onSave = () => {
    triggerReload();
    setSelectedType('associatedActions');
  };
  const handleErrors = () => setError(true);
  const updatedActionIds = [...selectedActionsSet, action].map(a => a.id);

  updateApplicationAlertActionAssociations(updatedActionIds, alertConfig.id).once(onSave, handleErrors);
}
