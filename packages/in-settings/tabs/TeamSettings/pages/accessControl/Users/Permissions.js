import React from 'react';

import permissions from 'in-settings/permissions';
import Pill from 'in-new-components/Pill';

import locals from './Permissions.mless';

export default function Permissions({ roles, roleId }) {
  const role = roles.filter(({ id }) => id === roleId)[0];
  if (!role) {
    return null;
  }

  return (
    <div className={locals.grid}>
      {Object.keys(permissions)
        .map(key => ({ label: permissions[key], disabled: !role[key] }))
        .map(({ disabled, label }, i) => (
          <Pill key={i} kind={disabled ? 'light' : undefined} color={disabled ? '#D4D8DB' : '#00B3B3'}>
            {label}
          </Pill>
        ))}
    </div>
  );
}
