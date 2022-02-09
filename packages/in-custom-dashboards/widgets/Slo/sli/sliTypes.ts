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
  SliConfigurationInput
} from 'in-types';
import { t } from 'in-i18n';

export const applicationType = 'application';
export const availabilityType = 'availability';
export const websiteTimeBased = 'websiteTimeBased';
export const websiteEventBased = 'websiteEventBased';

export type CombinedApplicationSliEntity = (ApplicationSliEntity | AvailabilitySliEntity) &
  Partial<ApplicationSliEntity & AvailabilitySliEntity>;
export type CombinedWebsiteSliEntity = WebsiteSliEntity &
  Partial<WebsiteTimeBasedSliEntity & WebsiteEventBasedSliEntity>;
export type CombinedSliEntity = SliEntity & Partial<CombinedApplicationSliEntity & CombinedWebsiteSliEntity>;

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

export function isWebsiteSliConfig(
  sliConfiguration: SliConfiguration
): sliConfiguration is SliConfig<WebsiteTimeBasedSliEntity> {
  return isWebsiteSliEntity(sliConfiguration.sliEntity);
}

export function isWebsiteSliEntity(sliEntity: SliEntity): sliEntity is WebsiteTimeBasedSliEntity {
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

export interface SliConfig<SLI_ENTITY_TYPE extends SliEntity = SliEntity> extends Omit<SliConfiguration, 'sliEntity'> {
  readonly sliEntity: SLI_ENTITY_TYPE;
}

export interface NewSliConfig<SLI_ENTITY_TYPE extends SliEntity = SliEntity>
  extends Omit<SliConfigurationInput, 'sliEntity'> {
  readonly sliEntity: SLI_ENTITY_TYPE;
}

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
