import React from 'react';

import Permission from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/Permission';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import SectionHeading from 'in-settings/components/SectionHeading';
import FormGroup from 'in-settings/components/FormGroup';
import permissions from 'in-settings/permissions';

export default function Permissions({ form, onChange, disabled }) {
  return (
    <>
      <SectionHeading>Websites & Mobile Apps</SectionHeading>
      <FormGroup noFlex>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureEumApplications"
          label={permissions['canConfigureEumApplications']}
          helpText="Permits configuration of website monitoring functionality."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureMobileAppMonitoring"
          label={permissions['canConfigureMobileAppMonitoring']}
          helpText="Permits configuration of mobile app monitoring functionality."
        />
      </FormGroup>

      <SectionHeading>Applications</SectionHeading>
      <FormGroup noFlex>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureApplications"
          label={permissions['canConfigureApplications']}
          helpText="Permits creation and configuration of applications."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureServiceMapping"
          label={permissions['canConfigureServiceMapping']}
          helpText="Permits configuration of services and endpoints."
        />
      </FormGroup>

      <SectionHeading>Infrastructure</SectionHeading>
      <FormGroup noFlex>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canInstallNewAgents"
          label={permissions['canInstallNewAgents']}
          helpText="Permits access to host agent and configuration."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAgents"
          label={permissions['canConfigureAgents']}
          helpText="Permits host agent configuration of all host agents through the UI."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAgentRunMode"
          label={permissions['canConfigureAgentRunMode']}
          helpText="Permits configuration of host agent mode through the UI."
        />
      </FormGroup>

      <SectionHeading>Events</SectionHeading>
      <FormGroup noFlex>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureIntegrations"
          label={permissions['canConfigureIntegrations']}
          helpText="Permits creation and configuration of integrations for use in alerting."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureCustomAlerts"
          label={permissions['canConfigureCustomAlerts']}
          helpText="Permits creation and configuration of custom alerts and associated integrations."
        />
      </FormGroup>

      <SectionHeading>Extensions</SectionHeading>
      <FormGroup noFlex>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canCreatePublicCustomDashboards"
          label={permissions['canCreatePublicCustomDashboards']}
          helpText="Without this permission, users can create custom dashboards visible only to themselves. Granting this permission allows users to make custom dashboards that are visible to all users of this Instana environment. Additionally, they are able to add editors to custom dashboards, which means they are able to see a full list of names and email addresses of all users of this Instana environment."
        />
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureLogManagement"
          label={permissions['canConfigureLogManagement']}
          helpText="Permits configuration of log management."
        />
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureReleases"
          label={permissions['canConfigureReleases']}
          helpText="Permits configuration of releases."
        />
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureGlobalAlertPayload"
          label={permissions['canConfigureGlobalAlertPayload']}
          helpText="Permits configuration of global custom payload for alerts."
        />
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureServiceLevelIndicators"
          label={permissions['canConfigureServiceLevelIndicators']}
          helpText="Permits definition and configuration of SLIs."
        />
      </FormGroup>

      <SectionHeading>Access Control</SectionHeading>
      <FormGroup noFlex>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureUsers"
          label={permissions['canConfigureUsers']}
          helpText="Permits inviting, modifying and removing user accounts."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureRoles"
          label={permissions['canConfigureRoles']}
          helpText="Permits configuration of access roles and permissions for all users."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureTeams"
          label={permissions['canConfigureTeams']}
          helpText="Permits configuration of access scopes and permissions for all teams."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureApiTokens"
          label={permissions['canConfigureApiTokens']}
          helpText="Permits creation and configuration of API tokens."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAuthenticationMethods"
          label={permissions['canConfigureAuthenticationMethods']}
          helpText="Permits configuration of team authentication methods (eg. 2FA/SSO)."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canViewAuditLog"
          label={permissions['canViewAuditLog']}
          helpText="Permits access to audit log for all users."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureSessionSettings"
          label={permissions['canConfigureSessionSettings']}
          helpText="Permits access to configure token and session timeouts."
        />
      </FormGroup>

      <SectionHeading>Usage</SectionHeading>
      <FormGroup noFlex>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canSeeUsageInformation"
          label={permissions['canSeeUsageInformation']}
          helpText="Permits access to license usage information."
          withoutBottomBorder={!onPremLicenseInformationEnabled}
        />

        {onPremLicenseInformationEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canSeeOnPremLicenseInformation"
            label={permissions['canSeeOnPremLicenseInformation']}
            helpText="Permits access to on prem license usage information."
            withoutBottomBorder
          />
        )}
      </FormGroup>
    </>
  );
}
