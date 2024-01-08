/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import {
  getEventSpecificationId,
  getIsCustomEvent,
  useEventSpecificationData,
  useDualReload
} from 'in-automation/AssociatedActions/sharedPolicies';
import { EventSpecification, getAllActionsWithAISuggestions, getAllActions, saveBulkPolicies } from 'in-automation/api';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import ActionTable, { ActionTableProps } from 'in-automation/ActionCatalog/ActionTable';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { Action, Event, TriggerType, VolatileId } from 'in-types';
import { createBulkPoliciesTracker } from 'in-automation/tracker';
import Policies from 'in-automation/AssociatedActions/Policies';
import { NewPolicy } from 'in-automation/Policies/types';
import { t } from 'in-i18n';

interface AssociatedPoliciesCardProps {
  event: Event;
  volatileId: VolatileId;
  reload?: number;
  setReload?: (r: number) => void;
}

export default function AssociatedPoliciesCard({
  event,
  volatileId,
  reload: externalReload,
  setReload: setExternalReload
}: AssociatedPoliciesCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);

  const [reload, triggerReload] = useDualReload(externalReload, setExternalReload);

  const { eventSpecification } = useEventSpecificationData(eventSpecificationId, isCustomEvent, reload);

  if (!eventSpecification) {
    return <LoadingIndicator size="xl" />;
  }
  let actionError = null;

  if (actionError) {
    return (
      <Message type="error" small withIcon>
        {actionError}
      </Message>
    );
  }

  return (
    <Policies
      title={t('in-automation:associatedPolicies')}
      event={event}
      volatileId={volatileId}
      triggerReload={triggerReload}
      rightHeader={
        <RightHeader
          eventSpecification={eventSpecification}
          triggerReload={triggerReload}
          isCustomEvent={isCustomEvent}
        />
      }
      triggerDetails={{
        triggerType: isCustomEvent ? 'customEvent' : 'builtinEvent',
        triggerId: eventSpecificationId
      }}
    />
  );
}

interface RightHeaderProps {
  eventSpecification: EventSpecification;
  triggerReload: () => void;
  isCustomEvent: boolean;
}
function RightHeader({ eventSpecification, isCustomEvent, triggerReload }: RightHeaderProps) {
  const allActions = useObservable<Action[], never[]>(getAllActions, []) ?? [];

  function submitActionSelection(selectedIds: string[]) {
    const updatedActionIds = [...selectedIds];
    const policies = [] as NewPolicy[];
    const updatedActions = allActions.reduce<Action[]>(
      (acc, action) => [...acc, ...(selectedIds.includes(action.id) ? [action] : [])],
      []
    );
    const actionNames = allActions.reduce<string[]>(
      (acc, action) => [...acc, ...(selectedIds.includes(action.id) ? [action.name] : [])],
      []
    );
    createBulkPoliciesTracker({
      triggerName: eventSpecification.name,
      actionNames: actionNames
    });
    updatedActionIds.forEach(ActionId => {
      const triggerType: TriggerType = isCustomEvent ? 'customEvent' : 'builtinEvent';
      const filteredAction = updatedActions.find(action => action.id === ActionId);
      if (filteredAction) {
        const policy = {
          name: `policy_${filteredAction.name}_${filteredAction.id}`,
          description: `${filteredAction.description}`,
          tags: [],
          trigger: {
            type: triggerType,
            id: eventSpecification.id
          },

          typeConfigurations: [
            {
              name: 'manual' as const,
              runnable: {
                type: 'action' as const,
                id: filteredAction.id,
                runConfiguration: {
                  actions: [
                    {
                      action: { id: filteredAction.id },
                      agentId: '',
                      inputParameterValues: []
                    }
                  ]
                }
              }
            }
          ]
        };
        policies.push(policy);
      }
    });
    return saveBulkPolicies(policies).once(triggerReload);
  }

  return (
    <SelectListDialogButton
      onSubmit={selectedActions => submitActionSelection(selectedActions)}
      title={t('in-automation:policies.addPolicies')}
      label={t('in-automation:policies.addPolicies')}
      listComponent={(props: ActionTableProps) => (
        <ActionTable
          {...props}
          loadEntities={() =>
            getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '')
          }
          scored
        />
      )}
      hiddenIds={[]}
      createSubmitLabel={numberOfItems =>
        numberOfItems > 0
          ? t('in-settings:tabs.addNumberOfItemsAction', { count: numberOfItems })
          : t('in-automation:policies.addPolicies')
      }
      requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
    />
  );
}
