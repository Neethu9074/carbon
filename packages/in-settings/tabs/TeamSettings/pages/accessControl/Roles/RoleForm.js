import React from 'react';

import { onPremLicenseInformationEnabled, isRbacEnabled } from 'in-services/featureFlags';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { ownerRoleId, fallbackRoleId, defaultRoleId } from 'in-stores/user';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import permissions from 'in-settings/permissions';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import './RoleForm.less';

export default function RoleForm({ form, onChange, roleId }) {
  const disabled = roleId == null || roleId === ownerRoleId || roleId === fallbackRoleId;

  return (
    <fieldset disabled={disabled}>
      <SectionHeading>General</SectionHeading>

      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="role-name" hasError={!field.valid && field.touched}>
            Name
          </Label>
          <Input
            id="role-name"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            disabled={disabled || roleId === defaultRoleId}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {isRbacEnabled && <SectionHeading>Restrictions</SectionHeading>}
      {isRbacEnabled && (
        <FormGroup noFlex>
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="restrictedAccess"
            label={permissions['restrictedAccess']}
            helpText="Enable role based access control."
          />
        </FormGroup>
      )}

      <SectionHeading>Permissions</SectionHeading>
      <FormGroup noFlex>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureServiceMapping"
          label={permissions['canConfigureServiceMapping']}
          helpText="Permits configuration of services and endpoints."
        />

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

        {isRbacEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canConfigureTeams"
            label={permissions['canConfigureTeams']}
            helpText="Permits configuration of access scopes and permissions for all teams."
          />
        )}

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canInstallNewAgents"
          label={permissions['canInstallNewAgents']}
          helpText="Permits access to agent and configuration."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canSeeUsageInformation"
          label={permissions['canSeeUsageInformation']}
          helpText="Permits access to license usage information."
        />

        {onPremLicenseInformationEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canSeeOnPremLicenseInformation"
            label={permissions['canSeeOnPremLicenseInformation']}
            helpText="Permits access to on prem license usage information."
          />
        )}

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
          name="canConfigureAgentRunMode"
          label={permissions['canConfigureAgentRunMode']}
          helpText="Permits configuration of agent mode through the UI."
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
          name="canConfigureAgents"
          label={permissions['canConfigureAgents']}
          helpText="Permits agent configuration of all agents through the UI."
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
          name="canConfigureApplications"
          label={permissions['canConfigureApplications']}
          helpText="Permits creation and configuration of applications."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureLogManagement"
          label={permissions['canConfigureLogManagement']}
          helpText="Permits configuration of log management."
        />
      </FormGroup>
    </fieldset>
  );
}

function Permission({ form, onChange, name, label, helpText, disabled }) {
  const field = form.get(name);

  return (
    <HorizontalFormGroup helpText={helpText}>
      <Label htmlFor={`role-${name}`}>{label}</Label>
      <Toggle
        id={`role-${name}`}
        checked={field.value}
        onChange={e => onChange(name, e.target.checked)}
        disabled={disabled}
      />
    </HorizontalFormGroup>
  );
}
