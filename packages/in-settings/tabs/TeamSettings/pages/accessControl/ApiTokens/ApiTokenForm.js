/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PermissionsList from 'in-settings/tabs/TeamSettings/pages/accessControl/Permissions/PermissionsList.js';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { apiTokenPermissions } from 'in-stores/permission';
import FormGroup from 'in-settings/components/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { role } from 'in-stores/user';

export default function ApiTokenForm({ form, onChange, disabled }) {
  return (
    <fieldset disabled={disabled}>
      <SectionHeading>{t('in-settings:tabs.general')}</SectionHeading>

      {form.get('accessGrantingToken').map(field => (
        <FormGroup>
          <Label htmlFor="api-token-accessGrantingToken">{t('in-settings:tabs.apiToken')}</Label>
          <Input id="api-token-accessGrantingToken" value={field.value} readOnly />
        </FormGroup>
      ))}

      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="api-token-name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
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

      <PermissionsList
        permissions={apiTokenPermissions}
        listActions={[
          {
            id: 'toggleEnabledAction',
            sortable: false,
            width: '5rem',
            widthInAbsoluteUnit: true,
            getContent(entity) {
              return (
                <Toggle
                  id={`permission-${entity.keyForApiTokenApi}`}
                  checked={form.get(entity.keyForApiTokenApi).map(field => field.value)}
                  onChange={e => onChange(entity.keyForApiTokenApi, e.target.checked)}
                  disabled={!role.canConfigureApiTokens}
                />
              );
            }
          }
        ]}
      />
    </fieldset>
  );
}
