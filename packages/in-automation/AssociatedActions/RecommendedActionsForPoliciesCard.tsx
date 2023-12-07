/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import { getEventSpecificationId, getIsCustomEvent, useAssociatedActionsData } from './sharedPolicies';
import { EventSpecification, getAllActionsWithAISuggestions, saveNewPolicy } from 'in-automation/api';
import NotificationComponent from 'in-components/form/Notification/Notification';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { Event, VolatileId, Action, Policy, Result } from 'in-types';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { associateActionsTracker } from 'in-automation/tracker';
import { getPoliciesForTrigger } from 'in-automation/api';
import { NewPolicy } from 'in-automation/Policies/types';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

interface SuggestedActionsCardProps {
  event: Event;
  volatileId: VolatileId;
  reload: number;
  setReload: (r: number) => void;
  setSelectedType: (str: string) => void;
}

export default function RecommendedActionsForPoliciesCard({
  event,
  volatileId,
  reload,
  setReload,
  setSelectedType
}: SuggestedActionsCardProps) {
  const [error, setError] = useState(false);
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);
  const policies =
    useObservable(
      () => getPoliciesForTrigger(eventSpecificationId, isCustomEvent ? 'customEvent' : 'builtinEvent'),
      [eventSpecificationId, isCustomEvent, reload]
    ) ?? (pendingResult as Result<Policy[]>);

  const selectedActionsSet = useMemo(() => {
    const filteredPolicies = isLoading(policies)
      ? policies
      : {
          ...policies,
          data: policies?.data
        };

    const actionsSet: string[] = [];

    filteredPolicies?.data?.forEach(policy => {
      policy.typeConfigurations.forEach(typeConfiguration => {
        if (
          typeConfiguration.runnable &&
          typeConfiguration.runnable.runConfiguration &&
          typeConfiguration.runnable.runConfiguration.actions
        ) {
          typeConfiguration.runnable.runConfiguration.actions.forEach(runnable => {
            if (runnable?.action.id) {
              actionsSet.push(runnable.action.id);
            }
          });
        }
      });
    });

    return actionsSet;
  }, [policies]);

  const { eventSpecification } = useAssociatedActionsData(eventSpecificationId, isCustomEvent, reload);

  const triggerReload = () => setReload(Math.random());

  const getUnusedSuggestedActions = useMemo(() => {
    if (!eventSpecification) return null;
    return getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '').map(
      allActions => {
        if (!policies) return [];
        return allActions
          .filter(action => action.confidence != 'low' && !selectedActionsSet.includes(action.id))
          .slice(0, 5)
          .sort((a, b) => b.score - a.score);
      }
    );
  }, [eventSpecification, policies, selectedActionsSet]);

  if (!eventSpecification || !getUnusedSuggestedActions) {
    return <LoadingIndicator size="xl" />;
  }

  return (
    <>
      {error && <NotificationComponent failure>{t('in-automation:failedToSaveAssocation')}</NotificationComponent>}

      <ActionTable
        noDataMessage={t('in-automation:noRecommendedActionsAvailable')}
        showActionLink
        title={t('in-automation:recommendedActions')}
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
                // existingActions,
                event: eventSpecification,
                triggerReload,
                setError,
                isCustomEvent,
                setSelectedType
              })
          }
        }}
      />
    </>
  );
}
interface AssociateActionProps {
  action: Action;
  event: EventSpecification;
  triggerReload: () => void;
  setError: (e: boolean) => void;
  isCustomEvent: boolean;
  setSelectedType: (str: string) => void;
}

function associateAction({
  action,
  event,
  triggerReload,
  setError,
  isCustomEvent,
  setSelectedType
}: AssociateActionProps) {
  associateActionsTracker({
    eventName: event.name,
    actionNames: [action.name]
  });

  const policy = getPolicySpecification(action, event, isCustomEvent);
  const onSave = () => {
    triggerReload();
    setSelectedType('associatedPolicies');
    oncreateSuccess(policy.name);
  };
  const handleErrors = () => {
    setError(true);
    onCreateFailed();
  };

  return saveNewPolicy(policy).once(onSave, handleErrors);
}

function oncreateSuccess(name: string) {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      title: t('in-automation:policies.onCreateSuccessTitle'),
      content: t('in-automation:policies.onCreateSuccessContent', {
        name
      })
    },
    'policy-success-info'
  );
}

function onCreateFailed() {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: t('in-automation:policies.deleteDialog.failure')
    },
    'policy-fail-error'
  );
}

function getPolicySpecification(action: Action, event: EventSpecification, isCustomEvent: boolean): NewPolicy {
  const triggerType = isCustomEvent ? 'customEvent' : 'builtinEvent';
  return {
    name: `Policy_${action.name}_test1`,
    description: action.description as string,
    tags: [],
    trigger: {
      type: triggerType,
      id: event.id
    },
    typeConfigurations: [
      {
        name: 'manual',
        runnable: {
          id: action.id,
          type: 'action',
          runConfiguration: {
            actions: [
              {
                action: { id: action.id },
                agentId: '123', //form.get('agentId').value,
                inputParameterValues: []
              }
            ]
          }
        }
      }
    ]
  };
}
