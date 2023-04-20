/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ApdexEntityApdexType } from '@instana/types';

import { applicationApdexEnabled } from 'in-services/featureFlags';

export interface LabeledEntity {
  label: string;
}
export type SloEntityTypes = Lowercase<ApdexEntityApdexType>;
export const AvailableEntityTypes: readonly SloEntityTypes[] = Object.freeze(
  (['website'] as SloEntityTypes[]).concat(applicationApdexEnabled ? ['application'] : [])
);
