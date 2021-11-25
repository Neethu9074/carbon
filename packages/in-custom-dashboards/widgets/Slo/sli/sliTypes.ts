/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const applicationType = 'application';
export const availabilityType = 'availability';
export const websiteTimeBased = 'websiteTimeBased';
export const websiteEventBased = 'websiteEventBased';

export const applicationSliTypeOptions = Object.freeze([
  { value: applicationType, label: t('in-custom-dashboards:widgets.slo.timeBased') },
  { value: availabilityType, label: t('in-custom-dashboards:widgets.slo.eventBased') }
] as const);

export const websiteSliTypeOptions = Object.freeze([
  { value: websiteTimeBased, label: t('in-custom-dashboards:widgets.slo.timeBased') },
  { value: websiteEventBased, label: t('in-custom-dashboards:widgets.slo.eventBased') }
] as const);
