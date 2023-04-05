/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography, Ul } from '@instana/components';

import {
  getAreaRoleFromPermissionSet,
  getScopeFromProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import {
  ProductArea,
  ScopedPermissionItem
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaExpandableListItem';
import { t } from 'in-i18n';

export const InfrastructureSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);

  const scopeId = permissionsSet.infraDfqFilter?.scopeId;
  const role = getAreaRoleFromPermissionSet(ProductArea.INFRASTRUCTURE, permissionsSet);
  const areaAccessScope = getScopeFromProductArea(ProductArea.INFRASTRUCTURE, permissionsSet);
  const hasNoAccess = areaAccessScope === ScopedPermissionItem.NO_ACCESS;

  const getColumnHeadline = () => {
    if (hasNoAccess) {
      return t('in-settings:productAreas.no_access');
    }

    return t('in-settings:productAreas.role', {
      context: role?.toLowerCase()
    });
  };

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
      firstColumnHeadline={getColumnHeadline()}
      firstColumnLabel={t('in-settings:productAreas.title_infrastructure')}
      subList={scopeId ? subListContent : null}
      disabled={hasNoAccess}
    >
      {!hasNoAccess ? (
        <Typography variant="body-small">{t('in-settings:productAreas.infrastructureContentMessage')}</Typography>
      ) : null}
    </AreaExpandableListItem>
  );
};
