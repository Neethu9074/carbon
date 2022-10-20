/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  ApdexConfiguration,
  ApplicationApdexEntity,
  isApplicationApdexEntity,
  isWebsiteApdexEntity,
  WebsiteApdexEntity
} from '@instana/types';
import { ApdexEntityApdexType } from '@instana/types';

import { applicationApdexEnabled } from 'in-services/featureFlags';
import { deepFreeze } from 'in-services/util/object';

export const enabledApdexBeaconTypes = deepFreeze(['httpRequest', 'pageLoad', 'custom'] as const);

export type ApdexEntityTypes = Lowercase<ApdexEntityApdexType>;
export const AvailableEntityTypes: readonly ApdexEntityTypes[] = Object.freeze(
  (['website'] as ApdexEntityTypes[]).concat(applicationApdexEnabled ? ['application'] : [])
);

export interface WebsiteApdexConfiguration extends Omit<ApdexConfiguration, 'apdexEntity'> {
  apdexEntity: WebsiteApdexEntity;
}

export interface ApplicationApdexConfiguration extends Omit<ApdexConfiguration, 'apdexEntity'> {
  apdexEntity: ApplicationApdexEntity;
}

export function isWebsiteApdexConfiguration(cfg: ApdexConfiguration): cfg is WebsiteApdexConfiguration {
  return isWebsiteApdexEntity(cfg.apdexEntity);
}

export function isApplicationApdexConfiguration(cfg: ApdexConfiguration): cfg is ApplicationApdexConfiguration {
  return isApplicationApdexEntity(cfg.apdexEntity);
}
