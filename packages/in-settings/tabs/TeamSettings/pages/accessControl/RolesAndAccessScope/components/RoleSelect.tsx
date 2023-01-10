/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import {
  AreaRoles,
  AreaRoleType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import Select from 'in-components/form/Select/Select';
import { t } from 'in-i18n';

export interface RoleSelectProps {
  defaultRole?: AreaRoleType;
  onChange: (role: AreaRoleType) => void;
}

export default function RoleSelect({ defaultRole, onChange }: RoleSelectProps) {
  return (
    <Select useFullWidth={false} onChange={e => onChange(e.target.value as AreaRoleType)} defaultValue={defaultRole}>
      <option value={undefined} disabled>
        {t('in-settings:permissionScope.role')}
      </option>
      {AreaRoles.map(context => (
        <option key={context} value={context}>
          {t('in-settings:permissionScope.role', { context: context.toLowerCase() })}
        </option>
      ))}
    </Select>
  );
}
