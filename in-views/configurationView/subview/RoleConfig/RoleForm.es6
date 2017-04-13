import React from 'react';

import HorizontalFormGroupWithBackground from 'in-views/configurationView/components/HorizontalFormGroupWithBackground';
import { objectivesEnabled, roleViewFilterEnabled } from 'in-services/featureFlags';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import HelpBlock from 'in-components/form/HelpBlock';
import { isOnPremise } from 'in-services/config';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function RoleForm({ form, onChange, disabled }) {
  return (
    <fieldset disabled={disabled}>
      <Section>
        <SectionHeading>
          General
        </SectionHeading>

        {form.get('name').map(field => (
          <FormGroup>
            <Label htmlFor="role-name" hasError={!field.valid}>
              Name
            </Label>
            <Input
              id="role-name"
              value={field.value}
              onChange={e => onChange('name', e.target.value)}
              hasError={!field.valid}
              disabled={disabled}
              autoFocus
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}

        {roleViewFilterEnabled &&
          form.get('implicitViewFilter').map(field => (
            <FormGroup>
              <Label htmlFor="role-implicit-view-filter" hasError={!field.valid}>
                View Filter
              </Label>
              <Input
                id="role-implicit-view-filter"
                value={field.value}
                onChange={e => onChange('implicitViewFilter', e.target.value)}
                hasError={!field.valid}
                disabled={disabled}
              />
              {field.messages.map((message, i) => (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              ))}
              <HelpBlock>
                Define a filter which will be applied to all the views and integrations. Only entities, events and traces
                {' '} matching this filter will be visible to the user.
              </HelpBlock>
            </FormGroup>
          ))}
      </Section>

      <Section>
        <SectionHeading>
          Permissions
        </SectionHeading>

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
          label="End-User Monitoring configuration"
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
          label="Access role configration"
        />

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

        {isOnPremise
          ? <Permission
              form={form}
              disabled={disabled}
              onChange={onChange}
              name="canSeeOnPremLicenseInformation"
              label="Access to on prem license usage"
            />
          : null}

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

        {objectivesEnabled
          ? <Permission
              form={form}
              disabled={disabled}
              onChange={onChange}
              name="canConfigureObjectives"
              label="Configuration of objectives"
            />
          : null}
      </Section>
    </fieldset>
  );
}

function Permission({ form, onChange, name, label, disabled }) {
  const field = form.get(name);

  return (
    <HorizontalFormGroupWithBackground>
      <Toggle
        id={`role-${name}`}
        checked={field.value}
        onChange={e => onChange(name, e.target.checked)}
        disabled={disabled}
      />

      <Label htmlFor={`role-${name}`}>
        {label}
      </Label>
    </HorizontalFormGroupWithBackground>
  );
}
