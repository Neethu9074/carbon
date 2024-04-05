/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { NewPolicy } from 'in-automation/Policies/types';
import { Action, Event, TriggerType } from 'in-types';

export const getTriggerTypeFromEvent = (event: Event): TriggerType => {
  if (event.metadata?.globalSmartAlert) {
    return 'globalApplicationSmartAlert';
  }
  if (event.metadata?.applicationId) {
    return 'applicationSmartAlert';
  }
  if (event.metadata?.websiteId) {
    return 'websiteSmartAlert';
  }
  if (event.metadata?.infraSmartAlert) {
    return 'infraSmartAlert';
  }
  if (event.metadata?.mobileAppId) {
    return 'mobileAppSmartAlert';
  }
  if (event.metadata?.logSmartAlert) {
    return 'logSmartAlert';
  }
  if (event.metadata?.syntheticTestId) {
    return 'syntheticsSmartAlert';
  }
  if (event.metadata?.custom_issue) {
    return 'customEvent';
  }
  return 'builtinEvent';
};

export const getTriggerIdFromEvent = (event: Event): string => event?.metadata?.eventSpecificationId;

export const createBasePolicy = (event: Event, action: Action): NewPolicy => {
  const initialName = `Policy_${action.name}_${action.id}`;
  // make sure name is  no longer than 127 characters
  const name = initialName.slice(0, 127);

  return {
    name,
    description: action.description ?? `Description for ${action.name}`,
    tags: [],
    trigger: {
      type: getTriggerTypeFromEvent(event),
      id: getTriggerIdFromEvent(event)
    },
    typeConfigurations: [
      {
        name: 'manual' as const,
        runnable: {
          type: 'action' as const,
          id: action.id,
          runConfiguration: {
            actions: [
              {
                action: { id: action.id },
                agentId: '',
                inputParameterValues: []
              }
            ]
          }
        }
      }
    ]
  };
};
