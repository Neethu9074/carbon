/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import { getAllActionsWithAISuggestions, saveNewPolicy, getPoliciesForTrigger } from 'in-automation/api';
import { Event, VolatileId, Action, ApplicationAlertConfigWithMetadata, Policy, Result } from 'in-types';
import NotificationComponent from 'in-components/form/Notification/Notification';
import { getEventSpecificationId, getIsCustomEvent } from './shared';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { associateActionsTracker } from 'in-automation/tracker';
import { NewPolicy } from 'in-automation/Policies/types';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

interface RecommendedActionsAlertsForPoliciesCardProps {
  event: Event;
  volatileId: VolatileId;
  reload: number;
  setReload: (r: number) => void;
  alertConfig?: ApplicationAlertConfigWithMetadata;
  setSelectedType: (str: string) => void;
}

export default function RecommendedActionsAlertsForPoliciesCard({
  event,
  volatileId,
  reload,
  setReload,
  alertConfig,
  setSelectedType
}: RecommendedActionsAlertsForPoliciesCardProps) {
  const [error, setError] = useState(false);

  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);

  const policies =
    useObservable(
      () => getPoliciesForTrigger(eventSpecificationId, 'applicationSmartAlert'),
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

  const triggerReload = () => setReload(Math.random());

  const getUnusedSuggestedActions = useMemo(() => {
    if (!alertConfig) return null;

    return getAllActionsWithAISuggestions(alertConfig.name, alertConfig.description ?? '').map(allActions => {
      return allActions
        .filter(action => action.confidence != 'low' && !selectedActionsSet.includes(action.id))
        .slice(0, 5)
        .sort((a, b) => b.score - a.score);
    });
  }, [alertConfig, selectedActionsSet]);

  if (!alertConfig || !getUnusedSuggestedActions || !selectedActionsSet) {
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
        title={t('in-automation:recommendedActions')}
        rightHeader={<></>} // required to get the title of the card to show with the beta badge
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
                alertConfig,
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
  setSelectedType
}: AssociateActionProps) {
  associateActionsTracker({
    eventName: alertConfig.name,
    actionNames: [action.name]
  });
  const onSave = () => {
    triggerReload();
    setSelectedType('associatedActions');
  };
  const policy = getPolicySpecification(action, alertConfig);
  const handleErrors = () => setError(true);

  return saveNewPolicy(policy).once(onSave, handleErrors);
}

function getPolicySpecification(action: Action, alertConfig: ApplicationAlertConfigWithMetadata): NewPolicy {
  const triggerType = 'applicationSmartAlert';
  return {
    name: `Policy_${action.name}_test1`,
    description: action.description as string,
    tags: [],
    trigger: {
      type: triggerType,
      id: alertConfig.id
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
