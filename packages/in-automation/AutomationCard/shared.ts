/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Action, Event, TriggerType } from '@instana/types';

import { NewPolicy } from 'in-automation/types';

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
  if (event.metadata?.sloId) {
    return 'sloSmartAlert';
  }
  if (event.metadata?.custom_issue) {
    return 'customEvent';
  }
  return 'builtinEvent';
};

export const getTriggerIdFromEvent = (event: Event): string => event?.metadata?.eventSpecificationId;

export const createBasePolicy = (
  event: Event,
  action: Action,
  { name, description, tags }: { name: string; description: string; tags: string[] } = {
    name: `Policy_${action.name}_${action.id}`,
    description: action.description ?? `Description for ${action.name}`,
    tags: []
  }
): NewPolicy => {
  const trimmedName = name.slice(0, 127);

  return {
    name: trimmedName,
    description,
    tags,
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
