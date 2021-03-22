/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const applicationType = 'application';
export const availabilityType = 'availability';

export const sliTypeOptions = Object.freeze([
  { value: applicationType, label: t('in-custom-dashboards:widgets.slo.timeBased') },
  { value: availabilityType, label: t('in-custom-dashboards:widgets.slo.eventBased') }
]);
