/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  AvailabilitySliEntity,
  ApplicationSliEntity,
  WebsiteEventBasedSliEntity,
  SliConfiguration,
  SliEntity,
  WebsiteTimeBasedSliEntity,
  WebsiteSliEntity,
  SliConfigurationInput,
  SliEntitySliType,
  SliEntityUnion
} from '@instana/types';

import { enabledApdexBeaconTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export const enabledSliBeaconTypes = deepFreeze(['httpRequest'] as const);

export type AvailableSliBeaconTypes = (typeof enabledSliBeaconTypes)[number];
export type AvailableApdexBeaconTypes = (typeof enabledApdexBeaconTypes)[number];
export type AvailableBeaconTypes = AvailableApdexBeaconTypes | AvailableSliBeaconTypes;

export const applicationType = 'application';
export const availabilityType = 'availability';
export const websiteTimeBased = 'websiteTimeBased';
export const websiteEventBased = 'websiteEventBased';

export type CombinedApplicationSliEntity = (ApplicationSliEntity | AvailabilitySliEntity) &
  Partial<Omit<ApplicationSliEntity, 'sliType'> & Omit<AvailabilitySliEntity, 'sliType'>>;
export type CombinedWebsiteSliEntity = WebsiteSliEntity &
  Partial<Omit<WebsiteTimeBasedSliEntity, 'sliType'> & Omit<WebsiteEventBasedSliEntity, 'sliType'>>;
export type CombinedSliEntity = SliEntity &
  Partial<Omit<CombinedApplicationSliEntity, 'sliType'> & Omit<CombinedWebsiteSliEntity, 'sliType'>>;

export function isAvailabilitySliConfig(
  sliConfiguration: SliConfiguration
): sliConfiguration is SliConfig<AvailabilitySliEntity> {
  return isAvailabilitySliEntity(sliConfiguration.sliEntity);
}

export function isAvailabilitySliEntity(sliEntity: SliEntity): sliEntity is AvailabilitySliEntity {
  return sliEntity.sliType === availabilityType;
}

export function isApplicationSliConfig(
  sliConfiguration: SliConfiguration
): sliConfiguration is SliConfig<ApplicationSliEntity> {
  return isApplicationSliEntity(sliConfiguration.sliEntity);
}

export function isApplicationSliEntity(sliEntity: SliEntity): sliEntity is ApplicationSliEntity {
  return sliEntity.sliType === applicationType;
}

export function isWebsiteTimeBasedSliConfig(
  sliConfiguration: SliConfiguration
): sliConfiguration is SliConfig<WebsiteTimeBasedSliEntity> {
  return isWebsiteTimeBasedSliEntity(sliConfiguration.sliEntity);
}

export function isWebsiteTimeBasedSliEntity(sliEntity: SliEntity): sliEntity is WebsiteTimeBasedSliEntity {
  return sliEntity.sliType === websiteTimeBased;
}

export function isWebsiteEventBasedSliConfig(
  sliConfiguration: SliConfiguration
): sliConfiguration is SliConfig<WebsiteEventBasedSliEntity> {
  return isWebsiteEventBasedSliEntity(sliConfiguration.sliEntity);
}

export function isWebsiteEventBasedSliEntity(sliEntity: SliEntity): sliEntity is WebsiteEventBasedSliEntity {
  return sliEntity.sliType === websiteEventBased;
}

export interface SliConfig<SLI_ENTITY_TYPE extends SliEntity = SliEntityUnion>
  extends Omit<SliConfiguration, 'sliEntity'> {
  readonly sliEntity: SLI_ENTITY_TYPE;
}

export interface NewSliConfig<SLI_ENTITY_TYPE extends SliEntity = SliEntityUnion>
  extends Omit<SliConfigurationInput, 'sliEntity'> {
  readonly sliEntity: SLI_ENTITY_TYPE;
}

export type SliType = Lowercase<SliEntitySliType>;

export type SliConfigBySliType<S extends SliType> = S extends 'website'
  ? SliConfig<WebsiteTimeBasedSliEntity | WebsiteEventBasedSliEntity>
  : SliConfig<ApplicationSliEntity | AvailabilitySliEntity>;

export type SliEntityType =
  | typeof applicationType
  | typeof availabilityType
  | typeof websiteTimeBased
  | typeof websiteEventBased;

export const applicationSliTypeOptions = Object.freeze([
  { value: applicationType, label: t('in-custom-dashboards:widgets.slo.timeBased') },
  { value: availabilityType, label: t('in-custom-dashboards:widgets.slo.eventBased') }
] as const);

export const websiteSliTypeOptions = Object.freeze([
  { value: websiteTimeBased, label: t('in-custom-dashboards:widgets.slo.timeBased') },
  { value: websiteEventBased, label: t('in-custom-dashboards:widgets.slo.eventBased') }
] as const);
