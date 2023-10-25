/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { SvgIcon, Typography } from '@instana/components';

import {
  AreaRolesWithContributerType,
  AreaRoleOptionsType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import RoleSelect, {
  RoleSelectProps
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleSelect';
import { AreaRoleType } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import Label from 'in-components/form/Label/Label';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './RoleFormGroup.mless';

interface RoleFormGroupProps extends Omit<RoleSelectProps, 'defaultRole'> {
  defaultRole: AreaRoleType;
  htmlFor: string;
  tooltipText: string | React.ReactElement;
  options?: AreaRolesWithContributerType | AreaRoleOptionsType;
}

export default function RoleFormGroup({
  htmlFor,
  tooltipText,
  value,
  defaultRole,
  onChange,
  options
}: RoleFormGroupProps) {
  // We want to update all permissions accordingly when we set the role to the default value
  useEffect(() => {
    if (value === undefined) {
      onChange(defaultRole);
    }
  }, [value, defaultRole, onChange]);

  return (
    <FormGroup>
      <Label htmlFor={htmlFor} className={locals.label}>
        <Typography variant="body-regular">{t('in-settings:permissionScope.roleSelection')}</Typography>
        <Tooltip content={tooltipText} delay={500} align="bottomMiddle">
          <SvgIcon type="lib_help_error_info_outline" size="xs" />
        </Tooltip>
      </Label>
      <RoleSelect value={value} defaultRole={defaultRole} onChange={onChange} options={options} />
    </FormGroup>
  );
}
