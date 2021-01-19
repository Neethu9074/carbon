/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { infraExplorePresentationEnabled, infraExploreDataEnabled } from 'in-services/featureFlags';
import { internalMonitoringUnit } from 'in-services/featureFlags';
import { isInstanaEmail } from 'in-stores/user';

const tenantUnitOrUserIsInternal = isInstanaEmail || internalMonitoringUnit;

export const infraExploreEnabled =
  (infraExploreDataEnabled && tenantUnitOrUserIsInternal) || infraExplorePresentationEnabled;
