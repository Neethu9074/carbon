/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIcon, Typography } from '@instana/components';

import RoleSelect, {
  RoleSelectProps
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleSelect';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Label from 'in-components/form/Label/Label';

import locals from './RoleFormGroup.mless';

interface RoleFormGroupProps extends RoleSelectProps {
  htmlFor: string;
  tooltipText: string;
}

export default function RoleFormGroup({ htmlFor, tooltipText, defaultRole, onChange }: RoleFormGroupProps) {
  return (
    <FormGroup>
      <Label htmlFor={htmlFor} className={locals.label}>
        <Typography variant="body-regular">Role</Typography>
        <Tooltip
          themeStyle="light"
          content={<Typography variant="body-regular">{tooltipText}</Typography>}
          align="bottomMiddle"
          delay={250}
        >
          <SvgIcon type="lib_help_error_info_outline" size="xs" />
        </Tooltip>
      </Label>
      <RoleSelect defaultRole={defaultRole} onChange={onChange} />
    </FormGroup>
  );
}
