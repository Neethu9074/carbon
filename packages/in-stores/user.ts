/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { config } from 'in-services/config';

export const ownerRoleId = '-1';
export const fallbackRoleId = '-2';
export const defaultRoleId = '-3';

export const user = window.instana.user;
export const tenant = user?.tenants.find(tenant => tenant.tenantKey === config.tenant);
export const role = user?.role ?? tenant?.role;

export const canSeeExtendedInternalMonitoring = role?.canSeeExtendedInternalMonitoring;

export const isOwner = role?.id === ownerRoleId;
