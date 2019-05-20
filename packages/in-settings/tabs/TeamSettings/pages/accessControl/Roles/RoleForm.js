import React from 'react';

import { onPremLicenseInformationEnabled, isRbacEnabled } from 'in-services/featureFlags';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { ownerRoleId, fallbackRoleId, defaultRoleId } from 'in-stores/user';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
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
            label="Limit access by team access scopes"
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
          label="Service & Endpoint Mapping"
          helpText="Permits configuration of services and endpoints."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureEumApplications"
          label="Website Monitoring configuration"
          helpText="Permits configuration of website monitoring functionality."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureUsers"
          label="User management"
          helpText="Permits inviting, modifying and removing user accounts."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureRoles"
          label="Access role configuration"
          helpText="Permits configuration of access roles and permissions for all users."
        />

        {isRbacEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canConfigureTeams"
            label="Access team configuration"
            helpText="Permits configuration of access scopes and permissions for all teams."
          />
        )}

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canInstallNewAgents"
          label="Agent download and agent key visibility"
          helpText="Permits access to agent and configuration."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canSeeUsageInformation"
          label="Access to license usage"
          helpText="Permits access to license usage information."
        />

        {onPremLicenseInformationEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canSeeOnPremLicenseInformation"
            label="Access to on prem license usage"
            helpText="Permits access to on prem license usage information."
          />
        )}

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureIntegrations"
          label="Configuration of integrations"
          helpText="Permits creation and configuration of integrations for use in alerting."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureCustomAlerts"
          label="Configuration of custom alerts"
          helpText="Permits creation and configuration of custom alerts and associated integrations."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureApiTokens"
          label="Configuration of API tokens"
          helpText="Permits creation and configuration of API tokens."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAgentRunMode"
          label="Configuration of agent mode"
          helpText="Permits configuration of agent mode through the UI."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canViewAuditLog"
          label="Access to audit log"
          helpText="Permits access to audit log for all users."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAgents"
          label="Configuration of agents"
          helpText="Permits agent configuration of all agents through the UI."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAuthenticationMethods"
          label="Configuration of authentication methods"
          helpText="Permits configuration of team authentication methods (eg. 2FA/SSO)."
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureApplications"
          label="Configuration of applications"
          helpText="Permits creation and configuration of applications."
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
