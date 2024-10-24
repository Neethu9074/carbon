/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Event, Result } from '@instana/types';

import {
  getApplicationSmartAlertConfig,
  getEventSpecification,
  getGlobalApplicationSmartAlertConfig,
  getInfraSmartAlertConfig,
  getLogSmartAlertConfig,
  getMobileAppSmartAlertConfig,
  getSloSmartAlertConfig,
  getSyntheticSmartAlertConfig,
  getWebsiteSmartAlertConfig
} from 'in-automation/api';
import { getTriggerIdFromEvent, getTriggerTypeFromEvent } from 'in-automation/AutomationCard/shared';
import { TriggerSpecification } from 'in-automation/types';
import { pendingResult } from 'in-services/fixedObjects';

interface UseTriggerParams {
  event: Event;
}

function getTrigger(event: Event): () => Observable<Result<TriggerSpecification>> {
  const triggerId = getTriggerIdFromEvent(event);
  const triggerType = getTriggerTypeFromEvent(event);
  switch (triggerType) {
    case 'builtinEvent':
    case 'customEvent':
      return () => getEventSpecification(triggerId);
    case 'applicationSmartAlert':
      return () => getApplicationSmartAlertConfig(triggerId);
    case 'websiteSmartAlert':
      return () => getWebsiteSmartAlertConfig(triggerId);
    case 'globalApplicationSmartAlert':
      return () => getGlobalApplicationSmartAlertConfig(triggerId);
    case 'mobileAppSmartAlert':
      return () => getMobileAppSmartAlertConfig(triggerId);
    case 'infraSmartAlert':
      return () => getInfraSmartAlertConfig(triggerId);
    case 'logSmartAlert':
      return () => getLogSmartAlertConfig(triggerId);
    case 'syntheticsSmartAlert':
      return () => getSyntheticSmartAlertConfig(triggerId);
    case 'sloSmartAlert':
      return () => getSloSmartAlertConfig(triggerId);
  }
}

export default function useTrigger({ event }: UseTriggerParams) {
  return useObservable(getTrigger(event), []) ?? (pendingResult as Result<TriggerSpecification>);
}
