/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { Stack, StackItem, Typography } from '@instana/components';

import SyntheticCommonSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/SyntheticAccessPanels/SyntheticCommonSection';
import {
  AreaRole,
  AreaRoleType,
  AreaRoleWithCustomType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { t } from 'in-i18n';

interface SyntheticAccessPanelProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  entityPermissionKey?: string;
  role?: AreaRoleWithCustomType;
  roleTooltipText?: string | React.ReactElement;
  description: string;
  onChangeRole?: (role: AreaRoleType) => void;
}

export default function SyntheticAccessAllPanel<FORM_TYPE extends MapFormItems>({
  role,
  form,
  description,
  setForm,
  entityPermissionKey,
  roleTooltipText,
  onChangeRole
}: SyntheticAccessPanelProps<FORM_TYPE>) {
  return (
    <Stack direction="vertical">
      <StackItem>
        <Typography variant="heading-200" component="div">
          {t('in-settings:permissionScope.description_access_all')}
        </Typography>
        <Typography variant="body-regular" component="div">
          {description}
        </Typography>
      </StackItem>
      {roleTooltipText && onChangeRole && entityPermissionKey && (
        <RoleFormGroup
          htmlFor={`${entityPermissionKey}-role-select`}
          tooltipText={roleTooltipText}
          value={role}
          defaultRole={AreaRole.VIEWER}
          onChange={onChangeRole}
        />
      )}
      {role === AreaRole.OWNER && <SyntheticCommonSection form={form} setForm={setForm} />}
    </Stack>
  );
}
