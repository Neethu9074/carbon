import { fromJS } from 'immutable';

import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getRoles() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/roles`
  }).map(response => fromJS(response.body));
}

export function getRole(roleId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/roles/${encodeURIComponent(roleId)}`
  }).map(response => fromJS(response.body));
}

export function saveRole(role) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/roles/${encodeURIComponent(role.get('id'))}`,
    data: role.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteRole(roleId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/roles/${encodeURIComponent(roleId)}`
  }).map(response => fromJS(response.body));
}

export function createRole(
  id,
  name = 'New Role',
  implicitViewFilter = '',
  canConfigureServiceMapping = true,
  canConfigureEumApplications = true,
  canConfigureUsers = true,
  canInstallNewAgents = true,
  canSeeUsageInformation = true,
  canConfigureIntegrations = true,
  canSeeOnPremLicenseInformation = true,
  canConfigureRoles = true,
  canConfigureCustomAlerts = true,
  canConfigureApiTokens = true,
  canConfigureAgentRunMode = true,
  canViewAuditLog = true,
  canConfigureObjectives = true,
  canConfigureAgents = true
) {
  return {
    id: id || generateUniqueShortId(),
    name,
    implicitViewFilter,
    canConfigureServiceMapping,
    canConfigureEumApplications,
    canConfigureUsers,
    canInstallNewAgents,
    canSeeUsageInformation,
    canConfigureIntegrations,
    canSeeOnPremLicenseInformation,
    canConfigureRoles,
    canConfigureCustomAlerts,
    canConfigureApiTokens,
    canConfigureAgentRunMode,
    canViewAuditLog,
    canConfigureObjectives,
    canConfigureAgents
  };
}
