import React from 'react';

import HorizontalFormGroupWithBackground from 'in-views/configurationView/components/HorizontalFormGroupWithBackground';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import {isOnPremise} from 'in-services/config';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';


export default function ApiTokenForm({form, onChange, disabled}) {
  return (
    <fieldset disabled={disabled}>
      <Section>
        <SectionHeading>
          General
        </SectionHeading>

        {form.get('name').map(field =>
          <FormGroup>
            <Label htmlFor='api-token-name'
                   hasError={!field.valid}>
              Name
            </Label>
            <Input id='api-token-name'
                   value={field.value}
                   onChange={e => onChange('name', e.target.value)}
                   hasError={!field.valid}
                   disabled={disabled}
                   autoFocus />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
          </FormGroup>
        )}
      </Section>

      <Section>
        <SectionHeading>
          Permissions
        </SectionHeading>

        <Permission form={form}
                    disabled={disabled}
                    onChange={onChange}
                    name='canConfigureServiceMapping'
                    label='Service Mapper' />

        <Permission form={form}
                    disabled={disabled}
                    onChange={onChange}
                    name='canConfigureEumApplications'
                    label='End-User Monitoring configuration' />

        <Permission form={form}
                    disabled={disabled}
                    onChange={onChange}
                    name='canConfigureUsers'
                    label='User management' />

        <Permission form={form}
                    disabled={disabled}
                    onChange={onChange}
                    name='canConfigureRoles'
                    label='Access role configration' />

        <Permission form={form}
                    disabled={disabled}
                    onChange={onChange}
                    name='canInstallNewAgents'
                    label='Agent download and agent key visibility' />

        <Permission form={form}
                    disabled={disabled}
                    onChange={onChange}
                    name='canSeeUsageInformation'
                    label='Access to license usage' />

        {isOnPremise ?
          <Permission form={form}
                      disabled={disabled}
                      onChange={onChange}
                      name='canSeeOnPremLicenseInformation'
                      label='Access to on prem license usage' />
        : null}

        <Permission form={form}
                    disabled={disabled}
                    onChange={onChange}
                    name='canConfigureIntegrations'
                    label='Configuration of integrations' />

        <Permission form={form}
                    disabled={disabled}
                    onChange={onChange}
                    name='canConfigureCustomAlerts'
                    label='Configuration of custom alerts' />

        <Permission form={form}
                    disabled={disabled}
                    onChange={onChange}
                    name='canConfigureApiTokens'
                    label='Configuration of API tokens' />
      </Section>
    </fieldset>
  );
}

function Permission({form, onChange, name, label, disabled}) {
  const field = form.get(name);

  return (
    <HorizontalFormGroupWithBackground>
      <Toggle id={`api-token-${name}`}
             checked={field.value}
             onChange={e => onChange(name, e.target.checked)}
             disabled={disabled} />

      <Label htmlFor={`api-token-${name}`}>
        {label}
      </Label>
    </HorizontalFormGroupWithBackground>
  );
}
