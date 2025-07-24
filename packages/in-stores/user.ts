/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import { config } from 'in-services/config';
import { Role } from 'in-types';

export const ownerRoleId = '-1';
export const fallbackRoleId = '-2';
export const defaultRoleId = '-3';

export const user = window.instana.user;
export const tenant = user?.tenants.find(tenant => tenant.tenantKey === config.tenant);

/**
 * @deprecated Use $role or useCurrentUserRole hook instead.
 * Due to the team focus feature, it is possible that the role including all
 * permissions can change at runtime, which is why static permissions checks
 * are now deprecated and should no longer be used.
 */
export const role = user?.role ?? tenant?.role;

/**
 * @deprecated Use $role or useCurrentUserRole hook to obtain a specific
 * permission value.
 * Due to the team focus feature, it is possible that the role including all
 * permissions can change at runtime, which is why static permissions checks
 * are now deprecated and should no longer be used.
 */
export const canSeeExtendedInternalMonitoring = role?.canSeeExtendedInternalMonitoring;

/**
 * An Observable that casts the currently active Role of a user. The role can
 * change at runtime, e.g. by switching the focussed team in the
 * TeamFocusDropwdown. Preferably use the useCurrentUserRole hook to obtain the
 * user's role and all updates to it from within a React pattern.
 **/
export const $role = create<Role | undefined>().emit(role);
