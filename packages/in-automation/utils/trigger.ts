/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TriggerType } from '@instana/types';

import {
  TriggerSpecification,
  isApplicationSmartAlert,
  isEventSpecification,
  isGlobalApplicationSmartAlert,
  isInfraSmartAlert,
  isMobileAppSmartAlert,
  isSloSmartAlert,
  isSyntheticsSmartAlert,
  isWebsiteSmartAlert
} from 'in-automation/types';

export const getTriggerType = (item: TriggerSpecification): TriggerType => {
  if (isApplicationSmartAlert(item)) {
    return 'applicationSmartAlert';
  }
  if (isGlobalApplicationSmartAlert(item)) {
    return 'globalApplicationSmartAlert';
  }
  if (isWebsiteSmartAlert(item)) {
    return 'websiteSmartAlert';
  }
  if (isMobileAppSmartAlert(item)) {
    return 'mobileAppSmartAlert';
  }
  if (isSyntheticsSmartAlert(item)) {
    return 'syntheticsSmartAlert';
  }
  if (isInfraSmartAlert(item)) {
    return 'infraSmartAlert';
  }
  if (isSloSmartAlert(item)) {
    return 'sloSmartAlert';
  }
  if (isEventSpecification(item) && item.type === 'CUSTOM') {
    return 'customEvent';
  }
  if (isEventSpecification(item) && item.type === 'BUILT_IN') {
    return 'builtinEvent';
  }
  return 'logSmartAlert';
};
