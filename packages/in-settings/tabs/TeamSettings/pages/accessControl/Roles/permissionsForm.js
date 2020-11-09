import { createField } from 'formalistic';

export function addPermissionFields(form, role) {
  return form
    .put('canConfigureServiceMapping', createField({ value: getInitialValue('canConfigureServiceMapping') }))
    .put('canConfigureEumApplications', createField({ value: getInitialValue('canConfigureEumApplications') }))
    .put('canConfigureUsers', createField({ value: getInitialValue('canConfigureUsers') }))
    .put('canInstallNewAgents', createField({ value: getInitialValue('canInstallNewAgents') }))
    .put('canSeeUsageInformation', createField({ value: getInitialValue('canSeeUsageInformation') }))
    .put('canConfigureIntegrations', createField({ value: getInitialValue('canConfigureIntegrations') }))
    .put('canSeeOnPremLicenseInformation', createField({ value: getInitialValue('canSeeOnPremLicenseInformation') }))
    .put('canConfigureRoles', createField({ value: getInitialValue('canConfigureRoles') }))
    .put('canConfigureTeams', createField({ value: getInitialValue('canConfigureTeams') }))
    .put('canConfigureCustomAlerts', createField({ value: getInitialValue('canConfigureCustomAlerts') }))
    .put('canConfigureApiTokens', createField({ value: getInitialValue('canConfigureApiTokens') }))
    .put('canConfigureAgentRunMode', createField({ value: getInitialValue('canConfigureAgentRunMode') }))
    .put('canViewAuditLog', createField({ value: getInitialValue('canViewAuditLog') }))
    .put('canConfigureAgents', createField({ value: getInitialValue('canConfigureAgents') }))
    .put(
      'canConfigureAuthenticationMethods',
      createField({ value: getInitialValue('canConfigureAuthenticationMethods') })
    )
    .put('canConfigureLogManagement', createField({ value: getInitialValue('canConfigureLogManagement') }))
    .put('canConfigureApplications', createField({ value: getInitialValue('canConfigureApplications') }))
    .put('canConfigureMobileAppMonitoring', createField({ value: getInitialValue('canConfigureMobileAppMonitoring') }))
    .put('canCreatePublicCustomDashboards', createField({ value: getInitialValue('canCreatePublicCustomDashboards') }))
    .put('canConfigureReleases', createField({ value: getInitialValue('canConfigureReleases') }))
    .put('canConfigureGlobalAlertPayload', createField({ value: getInitialValue('canConfigureGlobalAlertPayload') }))
    .put(
      'canConfigureServiceLevelIndicators',
      createField({ value: getInitialValue('canConfigureServiceLevelIndicators') })
    )
    .put('canViewLogs', createField({ value: getInitialValue('canViewLogs') ?? true }))
    .put('canViewTraceDetails', createField({ value: getInitialValue('canViewTraceDetails') ?? true }))
    .put('canConfigureSessionSettings', createField({ value: getInitialValue('canConfigureSessionSettings') }))
    .put(
      'canViewAccountAndBillingInformation',
      createField({ value: role.get('canViewAccountAndBillingInformation') })
    );

  // A small adapter so that this helper works with an immutableJS role or a plain JS object for API tokens.
  function getInitialValue(fieldName) {
    if (role.get) {
      return role.get(fieldName);
    }
    return role[fieldName];
  }
}
