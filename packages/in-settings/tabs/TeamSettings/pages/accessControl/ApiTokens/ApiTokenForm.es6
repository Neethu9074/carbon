import React from 'react';

import { onPremLicenseInformationEnabled, isRbacEnabled } from 'in-services/featureFlags';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function ApiTokenForm({ form, onChange, disabled }) {
  return (
    <fieldset disabled={disabled}>
      <SectionHeading>General</SectionHeading>

      {form.get('id').map(field => (
        <FormGroup>
          <Label htmlFor="api-token-id">API Token</Label>
          <Input id="api-token-id" value={field.value} readonly />
        </FormGroup>
      ))}

      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="api-token-name" hasError={!field.valid && field.touched}>
            Name
          </Label>
          <Input
            id="api-token-name"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      <SectionHeading>Permissions</SectionHeading>
      <FormGroup>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureServiceMapping"
          label="Service & Endpoint Mapping"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureServiceMapping"
          label="Service Mapper"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureEumApplications"
          label="Website Monitoring configuration"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureUsers"
          label="User management"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureRoles"
          label="Access role configuration"
        />

        {isRbacEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canConfigureTeams"
            label="Access team configuration"
          />
        )}

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canInstallNewAgents"
          label="Agent download and agent key visibility"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canSeeUsageInformation"
          label="Access to license usage"
        />

        {onPremLicenseInformationEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canSeeOnPremLicenseInformation"
            label="Access to on prem license usage"
          />
        )}

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureIntegrations"
          label="Configuration of integrations"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureCustomAlerts"
          label="Configuration of custom alerts"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureApiTokens"
          label="Configuration of API tokens"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAgentRunMode"
          label="Configuration of agent mode"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canViewAuditLog"
          label="Access to audit log"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAgents"
          label="Configuration of agents"
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureApplications"
          label="Configuration of applications"
        />
      </FormGroup>
    </fieldset>
  );
}

function Permission({ form, onChange, name, label, disabled }) {
  const field = form.get(name);

  return (
    <HorizontalFormGroup noHelpTextSpacer>
      <Label htmlFor={`api-token-${name}`}>{label}</Label>
      <Toggle
        id={`api-token-${name}`}
        checked={field.value}
        onChange={e => onChange(name, e.target.checked)}
        disabled={disabled}
      />
    </HorizontalFormGroup>
  );
}
