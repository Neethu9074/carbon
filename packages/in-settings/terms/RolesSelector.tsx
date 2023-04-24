/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { roles } from 'in-settings/terms/rolesConfig';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './RolesSelector.mless';

export interface Props {
  form: MapForm<any>;
  onChange: (fieldName: string, value: string) => void;
}

export default function RolesSelector({ form, onChange }: Props) {
  return (
    <div className={locals.wrapper}>
      {(form.get('role') as Field<string>).map(({ value }) => (
        <>
          <FormGroup>
            <Label htmlFor="role-selection">{t('in-settings:terms.role')}</Label>
            <Select
              name="role"
              value={value}
              onChange={e => onChange('role', e.target.value || '')}
              id="role-selection"
            >
              {!value && (
                <option disabled value="">
                  {t('in-settings:tabs.pleaseSelect')}
                </option>
              )}
              {roles.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormGroup>

          {form.get('dynamicRole') && (
            <FormGroup>
              <Label htmlFor="dynamic-role-selection">{t('in-settings:terms.whatIsYourRole')}</Label>
              {(form.get('dynamicRole') as Field<string>).map(dynamicRoleField => (
                <>
                  <Input
                    id="dynamic-role-selection"
                    name="dynamic-role-selection"
                    type="text"
                    value={dynamicRoleField.value}
                    onChange={e => onChange('dynamicRole', e.target.value || '')}
                    hasError={dynamicRoleField.touched && !dynamicRoleField.valid}
                  />
                  <TouchedMessages field={dynamicRoleField} />
                </>
              ))}
            </FormGroup>
          )}
        </>
      ))}
    </div>
  );
}
