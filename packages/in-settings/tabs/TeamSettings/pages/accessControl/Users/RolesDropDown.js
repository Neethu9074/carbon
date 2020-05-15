import React from 'react';

import { fallbackRoleId } from 'in-stores/user';
import ComboBox from 'in-components/ComboBox';

export default function RoleComboBox({ user, roles, form, setForm }) {
  if (!user || !roles) {
    return null;
  }

  const options = roles
    .filter(role => role.id !== fallbackRoleId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(role => ({
      value: role.id,
      label: role.name
    }));

  return (
    <ComboBox
      name="user-management-roles"
      value={form.get('roleId').value}
      options={options}
      onChange={e => {
        setForm(form.updateIn(['roleId'], f => f.setValue(e.value).setTouched(true)));
      }}
      clearable={false}
    />
  );
}
