import React from 'react';

import { onPremLicenseInformationEnabled, isRbacEnabled } from 'in-services/featureFlags';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import permissions from 'in-settings/permissions';
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
          label={permissions['canConfigureServiceMapping']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureEumApplications"
          label={permissions['canConfigureEumApplications']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureMobileAppMonitoring"
          label={permissions['canConfigureMobileAppMonitoring']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureUsers"
          label={permissions['canConfigureUsers']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureRoles"
          label={permissions['canConfigureRoles']}
        />

        {isRbacEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canConfigureTeams"
            label={permissions['canConfigureTeams']}
          />
        )}

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canInstallNewAgents"
          label={permissions['canInstallNewAgents']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canSeeUsageInformation"
          label={permissions['canSeeUsageInformation']}
        />

        {onPremLicenseInformationEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canSeeOnPremLicenseInformation"
            label={permissions['canSeeOnPremLicenseInformation']}
          />
        )}

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureIntegrations"
          label={permissions['canConfigureIntegrations']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureCustomAlerts"
          label={permissions['canConfigureCustomAlerts']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureApiTokens"
          label={permissions['canConfigureApiTokens']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAgentRunMode"
          label={permissions['canConfigureAgentRunMode']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canViewAuditLog"
          label={permissions['canViewAuditLog']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureAgents"
          label={permissions['canConfigureAgents']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureApplications"
          label={permissions['canConfigureApplications']}
        />

        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canConfigureReleases"
          label={permissions['canConfigureReleases']}
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
