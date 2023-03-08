/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography, Ul } from '@instana/components';

import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { getAreaRoleFromPermissionSet } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { ProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

export const InfrastructureSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);

  const scopeId = permissionsSet.infraDfqFilter?.scopeId;
  const role = getAreaRoleFromPermissionSet(ProductArea.INFRASTRUCTURE, permissionsSet);

  const columnHeadline = t('in-settings:productAreas.role', {
    context: role?.toLowerCase()
  });

  const subListContent = (
    <Ul>
      <Li>
        <Typography variant="body-regular">{scopeId}</Typography>
      </Li>
    </Ul>
  );

  return (
    <AreaExpandableListItem
      iconType="lib_infrastructure_inverted"
      firstColumnHeadline={columnHeadline}
      firstColumnLabel={t('in-settings:productAreas.infrastructure')}
      subList={scopeId ? subListContent : null}
    >
      <Typography variant="body-small">{t('in-settings:productAreas.infrastructureContentMessage')}</Typography>
    </AreaExpandableListItem>
  );
};
