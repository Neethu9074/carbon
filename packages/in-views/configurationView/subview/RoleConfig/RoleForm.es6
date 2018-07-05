import React from 'react';

import HorizontalFormGroupWithBackground from 'in-views/configurationView/components/HorizontalFormGroupWithBackground';
import { twoZeroModeEnabled, roleViewFilterEnabled } from 'in-services/featureFlags';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import Section from 'in-views/configurationView/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Helpify from 'in-components/form/Helpify';
import { isOnPremise } from 'in-services/config';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import './RoleForm.less';

const block = 'in-role-form';

export default function RoleForm({ form, onChange, disabled }) {
  return (
    <fieldset disabled={disabled}>
      <Section>
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
              disabled={disabled}
              autoFocus
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {roleViewFilterEnabled &&
          form.get('implicitViewFilter').map(field => (
            <FormGroup>
              <Label htmlFor="role-implicit-view-filter" hasError={!field.valid && field.touched}>
                View Filter
              </Label>
              <Helpify helpText="Define a filter which will be applied to all the views and integrations. Only entities, events and traces {' '} matching this filter will be visible to the user.">
                <Input
                  id="role-implicit-view-filter"
                  value={field.value}
                  className={`${block}__helpfified_input`}
                  onChange={e => onChange('implicitViewFilter', e.target.value)}
                  hasError={!field.valid && field.touched}
                  disabled={disabled}
                />
                <TouchedMessages field={field} />
              </Helpify>
            </FormGroup>
          ))}
      </Section>

      <Section>
        <SectionHeading>Permissions</SectionHeading>

        {!twoZeroModeEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canConfigureServiceMapping"
            label="Service Mapper"
            helpText="Permits configuration of services."
          />
        )}

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
          label="Access role configration"
          helpText="Permits configuration of access roles and permissions for all users."
        />

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

        {isOnPremise ? (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canSeeOnPremLicenseInformation"
            label="Access to on prem license usage"
            helpText="Permits access to on prem license usage information."
          />
        ) : null}

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

        {twoZeroModeEnabled && (
          <Permission
            form={form}
            disabled={disabled}
            onChange={onChange}
            name="canConfigureApplications"
            label="Configuration of applications"
            helpText="Permits creation and configuration of applications."
          />
        )}
      </Section>
    </fieldset>
  );
}

function Permission({ form, onChange, name, label, helpText, disabled }) {
  const field = form.get(name);

  return (
    <HorizontalFormGroupWithBackground>
      <Toggle
        id={`role-${name}`}
        checked={field.value}
        onChange={e => onChange(name, e.target.checked)}
        disabled={disabled}
      />
      {helpText ? (
        <Tooltip content={helpText} align="rightMiddle">
          <SvgIcon type="info" width={16} height={16} color="#172429" />
        </Tooltip>
      ) : null}
      <Label htmlFor={`role-${name}`}>{label}</Label>
    </HorizontalFormGroupWithBackground>
  );
}
