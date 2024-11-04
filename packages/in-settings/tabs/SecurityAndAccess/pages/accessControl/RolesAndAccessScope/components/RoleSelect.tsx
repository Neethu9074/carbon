/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Select } from '@instana/components';

import {
  AreaRoles,
  AreaRolesWithContributorOptionsType,
  AreaRoleType,
  AreaRoleWithCustomType,
  AreaRoleWithContributorType,
  AreaRoleOptionsType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

export interface RoleSelectProps {
  value?: AreaRoleWithCustomType;
  defaultRole?: AreaRoleType;
  onChange: (role: AreaRoleType | AreaRoleWithContributorType) => void;
  options?: AreaRoleOptionsType | AreaRolesWithContributorOptionsType;
}

export default function RoleSelect({ value, onChange, options = AreaRoles }: RoleSelectProps) {
  return (
    <Select
      useFullWidth={false}
      onChange={e => onChange(e.target.value as AreaRoleType | AreaRoleWithContributorType)}
      value={value}
    >
      <option value="" disabled>
        {t('in-settings:permissionScope.role')}
      </option>
      {options.map(context => (
        <option key={context} value={context}>
          {t('in-settings:permissionScope.role', { context: context.toLowerCase() })}
        </option>
      ))}

      {/* // This is only necessary while in migration phase and should be removed after some releases */}
      {value === 'CUSTOM' && (
        <option value="CUSTOM" disabled hidden>
          {t('in-settings:permissionScope.role', { context: 'custom' })}
        </option>
      )}
    </Select>
  );
}
