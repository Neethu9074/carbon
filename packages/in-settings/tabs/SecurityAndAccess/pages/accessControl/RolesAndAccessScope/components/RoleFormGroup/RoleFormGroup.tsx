/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import {
  AreaRolesWithContributorOptionsType,
  AreaRoleOptionsType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import RoleSelect, {
  RoleSelectProps
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/RoleSelect';
import { AreaRoleType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './RoleFormGroup.mless';

interface RoleFormGroupProps extends Omit<RoleSelectProps, 'defaultRole'> {
  defaultRole: AreaRoleType;
  htmlFor: string;
  options?: AreaRolesWithContributorOptionsType | AreaRoleOptionsType;
  roleDescription?: string;
}

export default function RoleFormGroup({
  htmlFor,
  value,
  defaultRole,
  onChange,
  roleDescription,
  options
}: RoleFormGroupProps) {
  // We want to update all permissions accordingly when we set the role to the default value
  useEffect(() => {
    if (value === undefined) {
      onChange(defaultRole);
    }
  }, [value, defaultRole, onChange]);

  return (
    <>
      <FormGroup>
        <Label htmlFor={htmlFor} className={locals.accessType_label}>
          {t('in-settings:permissionScope.access_type')}
        </Label>
        <RoleSelect value={value} defaultRole={defaultRole} onChange={onChange} options={options} />
        <Label htmlFor={htmlFor} className={locals.accessType_description}>
          {roleDescription}
        </Label>
      </FormGroup>
    </>
  );
}
