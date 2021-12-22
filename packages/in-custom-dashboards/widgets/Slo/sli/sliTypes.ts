/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';
import {
  AvailabilitySliEntity,
  ApplicationSliEntity,
  WebsiteEventBasedSliEntity,
  WebsiteSliEntity,
  SliConfigurationWithLastUpdated,
  SliConfiguration
} from 'in-types';

export const applicationType = 'application';
export const availabilityType = 'availability';
export const websiteTimeBased = 'websiteTimeBased';
export const websiteEventBased = 'websiteEventBased';

export function isAvailabilitySliConfig(
  sliConfiguration: SliConfiguration
): sliConfiguration is SliConfig<AvailabilitySliEntity> {
  return sliConfiguration.sliEntity.sliType === availabilityType;
}

export function isApplicationSliConfig(
  sliConfiguration: SliConfiguration
): sliConfiguration is SliConfig<ApplicationSliEntity> {
  return sliConfiguration.sliEntity.sliType === applicationType;
}

export function isWebsiteSliEntity(
  sliConfiguration: SliConfiguration
): sliConfiguration is SliConfig<WebsiteSliEntity> {
  return sliConfiguration.sliEntity.sliType === websiteTimeBased;
}

export function isWebsiteEventBasedSliEntity(
  sliConfiguration: SliConfiguration
): sliConfiguration is SliConfig<WebsiteEventBasedSliEntity> {
  return sliConfiguration.sliEntity.sliType === websiteEventBased;
}

export interface SliConfig<SLI_ENTITY_TYPE> extends Omit<SliConfigurationWithLastUpdated, 'sliEntity'> {
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
