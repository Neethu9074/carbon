/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { Event, VolatileId, Action, ApplicationAlertConfigWithMetadata, TriggerType } from 'in-types';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import { getAllActions, getAllActionsWithAISuggestions, saveBulkPolicies } from 'in-automation/api';
import ActionTable, { ActionTableProps } from 'in-automation/ActionCatalog/ActionTable';
import { getEventSpecificationId, useDualReload } from './sharedPolicies';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { createBulkPoliciesTracker } from 'in-automation/tracker';
import Policies from 'in-automation/AssociatedActions/Policies';
import { NewPolicy } from 'in-automation/Policies/types';
import { t } from 'in-i18n';

interface AssociatedActionsCardProps {
  event: Event;
  volatileId: VolatileId;
  alertConfig?: ApplicationAlertConfigWithMetadata | null;
  reload?: number;
  setReload?: (r: number) => void;
}

export default function AssociatedPoliciesAlerts({
  event,
  volatileId,
  alertConfig,
  reload: externalReload,
  setReload: setExternalReload
}: AssociatedActionsCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);

  const [reload, triggerReload] = useDualReload(externalReload, setExternalReload);
  if (!alertConfig) {
    return <LoadingIndicator size="xl" />;
  }

  return (
    <Policies
      title={t('in-automation:associatedPolicies')}
      event={event}
      volatileId={volatileId}
      triggerReload={triggerReload}
      rightHeader={<RightHeader eventSpecification={alertConfig} triggerReload={triggerReload} reload={reload} />}
      triggerDetails={{ triggerType: 'applicationSmartAlert', triggerId: eventSpecificationId }}
    />
  );
}

interface RightHeaderProps {
  eventSpecification: ApplicationAlertConfigWithMetadata;
  triggerReload: () => void;
  reload?: number;
}

function RightHeader({ eventSpecification, triggerReload }: RightHeaderProps) {
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
      const triggerType: TriggerType = 'applicationSmartAlert';
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
          : t('in-settings:tabs.addActions')
      }
      requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
    />
  );
}
