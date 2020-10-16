import { createField } from 'formalistic';

export function addPermissionFields(form, role) {
  return form
    .put('canConfigureServiceMapping', createField({ value: role.get('canConfigureServiceMapping') }))
    .put('canConfigureEumApplications', createField({ value: role.get('canConfigureEumApplications') }))
    .put('canConfigureUsers', createField({ value: role.get('canConfigureUsers') }))
    .put('canInstallNewAgents', createField({ value: role.get('canInstallNewAgents') }))
    .put('canSeeUsageInformation', createField({ value: role.get('canSeeUsageInformation') }))
    .put('canConfigureIntegrations', createField({ value: role.get('canConfigureIntegrations') }))
    .put('canSeeOnPremLicenseInformation', createField({ value: role.get('canSeeOnPremLicenseInformation') }))
    .put('canConfigureRoles', createField({ value: role.get('canConfigureRoles') }))
    .put('canConfigureTeams', createField({ value: role.get('canConfigureTeams') }))
    .put('canConfigureCustomAlerts', createField({ value: role.get('canConfigureCustomAlerts') }))
    .put('canConfigureApiTokens', createField({ value: role.get('canConfigureApiTokens') }))
    .put('canConfigureAgentRunMode', createField({ value: role.get('canConfigureAgentRunMode') }))
    .put('canViewAuditLog', createField({ value: role.get('canViewAuditLog') }))
    .put('canConfigureAgents', createField({ value: role.get('canConfigureAgents') }))
    .put('canConfigureAuthenticationMethods', createField({ value: role.get('canConfigureAuthenticationMethods') }))
    .put('canConfigureLogManagement', createField({ value: role.get('canConfigureLogManagement') }))
    .put('canConfigureApplications', createField({ value: role.get('canConfigureApplications') }))
    .put('canConfigureMobileAppMonitoring', createField({ value: role.get('canConfigureMobileAppMonitoring') }))
    .put('canCreatePublicCustomDashboards', createField({ value: role.get('canCreatePublicCustomDashboards') }))
    .put('canConfigureReleases', createField({ value: role.get('canConfigureReleases') }))
    .put('canConfigureGlobalAlertPayload', createField({ value: role.get('canConfigureGlobalAlertPayload') }))
    .put('canConfigureServiceLevelIndicators', createField({ value: role.get('canConfigureServiceLevelIndicators') }))
    .put('canViewLogs', createField({ value: role.get('canViewLogs') ?? true }))
    .put('canViewTraceDetails', createField({ value: role.get('canViewTraceDetails') ?? true }))
    .put('canConfigureSessionSettings', createField({ value: role.get('canConfigureSessionSettings') }));
}
