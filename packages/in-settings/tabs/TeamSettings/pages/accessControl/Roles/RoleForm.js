import React from 'react';

import Permissions from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/Permissions';
import Permission from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/Permission';
import { ownerRoleId, fallbackRoleId, defaultRoleId } from 'in-stores/user';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import permissions from 'in-settings/permissions';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

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

      <SectionHeading>Restrictions</SectionHeading>

      <FormGroup noFlex>
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="restrictedAccess"
          label={permissions['restrictedAccess']}
          helpText="Enable role based access control."
        />
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canViewLogs"
          label={permissions['canViewLogs']}
          helpText="Enable access to logs."
        />
        <Permission
          form={form}
          disabled={disabled}
          onChange={onChange}
          name="canViewTraceDetails"
          label={permissions['canViewTraceDetails']}
          helpText="Enable access to trace details."
        />
      </FormGroup>

      <Permissions form={form} onChange={onChange} disabled={disabled} />
    </fieldset>
  );
}
