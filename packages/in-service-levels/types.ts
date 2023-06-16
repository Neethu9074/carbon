/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { BeaconType, ServiceLevelObjectiveConfiguration } from '@instana/types';

export interface LabeledEntity {
  label: string;
}

export type SloBeaconTypes = Extract<BeaconType, 'httpRequest' | 'pageLoad' | 'custom'>;

export type SloConfigType = Partial<ServiceLevelObjectiveConfiguration>;
