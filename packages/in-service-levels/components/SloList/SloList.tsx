/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import { LabeledEntity } from 'in-service-levels/types';

export interface SloListItem {
  configuration: ServiceLevelObjectiveConfiguration;
  // This is not final
  status: number;
  entity: LabeledEntity;
}

// This is a placeholder for now
export default function SloList() {
  return undefined;
}
