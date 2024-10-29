/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  track,
  ENTERPRISE_IDP_MAPPING_FIRST,
  ENTERPRISE_IDP_MAPPING_CHANGED,
  ENTERPRISE_IDP_MAPPING_REMOVED,
  ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS,
  ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS_REMOVE
} from 'in-services/tracking/tracking';

export const firstMappingAdded = (e: any) => track(ENTERPRISE_IDP_MAPPING_FIRST, e);
export const mappingChanged = (e: any) => track(ENTERPRISE_IDP_MAPPING_CHANGED, e);
export const mappingRemoved = () => track(ENTERPRISE_IDP_MAPPING_REMOVED, {});
export const enabledRestrictedAccess = () => track(ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS, {});
export const disabledRestrictedAccess = () => track(ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS_REMOVE, {});
