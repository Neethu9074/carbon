/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useParams } from 'react-router';
import React from 'react';

import { CarbonColumn, CarbonGrid, Typography } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';

import RolePermissionsAccordionTile from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/RolePermissionsAccordionTile';
import RoleMembersTile from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/RoleMembersTile';
import useRoleDetails from 'in-settings/tabs/SecurityAndAccess/hooks/useRoleDetails';
import { t } from 'in-i18n';

export default function RoleDetails() {
  const { id: roleId } = useParams<{ id: string }>();
  const [role, status] = useRoleDetails({ id: roleId });

  return (
    <CarbonGrid fullWidth>
      <CarbonColumn sm="100%">
        <Typography variant="heading-100" noMargin>
          {t('in-settings:details.role.title')}
        </Typography>
        {status === 'pending' ? (
          <LoadingSkeleton
            style={{
              width: '40%',
              display: 'inline-block',
              height: 'var(--cds-spacing-07)',
              marginBottom: 'var(--cds-spacing-05)'
            }}
          />
        ) : (
          <Typography variant="heading-300" component="h3">
            {role?.name}
          </Typography>
        )}
      </CarbonColumn>
      <CarbonColumn md={8}>
        <RolePermissionsAccordionTile role={role} status={status} />
      </CarbonColumn>
      <CarbonColumn md={8}>
        <RoleMembersTile role={role} status={status} />
      </CarbonColumn>
    </CarbonGrid>
  );
}
