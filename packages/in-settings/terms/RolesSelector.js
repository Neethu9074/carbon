/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import ComboBox from 'in-components/ComboBox/ComboBox';
import { roles } from 'in-settings/terms/rolesConfig';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './RolesSelector.mless';

export default function RolesSelector({ form, onChange }) {
  return (
    <>
      <Label>{t('in-settings:terms.role')}</Label>
      {form.get('role').map(({ value }) => (
        <>
          <ComboBox
            className={locals.comboBox}
            name="role"
            value={value}
            options={roles}
            onChange={e => onChange('role', e.value || '')}
            searchable
            clearable={false}
          />
          {form.get('dynamicRole') && (
            <>
              <p className={locals.roleTitle}>{t('in-settings:terms.whatIsYourRole')}</p>
              {form.get('dynamicRole').map(dynamicRoleField => (
                <>
                  <Input
                    className={locals.dynamicRoleInput}
                    type="text"
                    value={dynamicRoleField.value}
                    onChange={e => onChange('dynamicRole', e.target.value || '')}
                    hasError={dynamicRoleField.touched && !dynamicRoleField.valid}
                  />
                  <TouchedMessages field={dynamicRoleField} />
                </>
              ))}
            </>
          )}
        </>
      ))}
    </>
  );
}
