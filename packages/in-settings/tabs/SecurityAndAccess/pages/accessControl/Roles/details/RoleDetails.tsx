/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { PropsWithChildren, useEffect } from 'react';
import { useParams } from 'react-router';

import { Column, Grid, InlineLoading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@instana/carbon';
import { MoreMenu, MoreMenuButton, Typography } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';
import { generateStableHash } from '@instana/utils';

import RolePermissionsAccordionTile from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/RolePermissionsAccordionTile';
import RolesAndAccessScopeTile from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/RoleAccessScopeTile';
import EditRoleScopeDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleScopeDialog';
import usePermissionCount from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/hooks/usePermissionCount';
import RoleMembersTile from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/RoleMembersTile';
import { RoleDetailsWithPermissions } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import EditRoleDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog';
import useRoleDetails from 'in-settings/tabs/SecurityAndAccess/hooks/useRoleDetails';
import { FORM_MODE } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

import locals from './RoleDetails.mless';

export default function RoleDetails() {
  const { id: roleId } = useParams<{ id: string }>();
  const [role, status] = useRoleDetails({ id: roleId });
  const [{ availablePermissions, enabledPermissions }, addPermissionItems, resetPermissionItems] = usePermissionCount();

  const { permissions, hasScope } = role ?? {};

  // We must reset the permission items if the permissions array has changed;
  // for example after editing the permissions of a role.
  useEffect(resetPermissionItems, [resetPermissionItems, generateStableHash(permissions)]);

  const permissionsAccordion = (
    <RolePermissionsAccordionTile
      addPermissionItems={addPermissionItems}
      availablePermissions={availablePermissions}
      enabledPermissions={enabledPermissions}
      role={role}
      showHeader={hasScope}
      status={status}
    />
  );

  return (
    <Grid fullWidth>
      <Column sm="100%">
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
      </Column>
      <Column md={8}>
        <FloatingMenuButtons status={status} role={role} />
        {hasScope && (
          <AccessScopeTabs
            availablePermissions={availablePermissions}
            enabledPermissions={enabledPermissions}
            roleId={roleId}
          >
            {permissionsAccordion}
          </AccessScopeTabs>
        )}
        {!hasScope && permissionsAccordion}
      </Column>
      <Column md={8}>
        <RoleMembersTile role={role} status={status} />
      </Column>
    </Grid>
  );
}

interface AccessScopeTabsProps {
  availablePermissions: number;
  enabledPermissions: number;
  roleId: string;
}

function AccessScopeTabs({
  availablePermissions,
  children,
  enabledPermissions,
  roleId
}: PropsWithChildren<AccessScopeTabsProps>) {
  return (
    <Tabs>
      <TabList contained aria-label={t('in-settings:details.role.permissionTabsLabel')}>
        <Tab secondaryLabel={`(${enabledPermissions}/${availablePermissions})`}>
          {t('in-settings:details.role.permissionTabsPermissionsLabel')}
        </Tab>
        <Tab secondaryLabel={t('in-settings:details.role.permissionTabsScopeScopeSecondaryLabel')}>
          {t('in-settings:details.role.permissionTabsScopeLabel')}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{children}</TabPanel>
        <TabPanel>
          <RolesAndAccessScopeTile roleId={roleId} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

interface FloatingMenuButtonsProps {
  role?: RoleDetailsWithPermissions;
  status: FetchStatus;
}

function FloatingMenuButtons({ role, status }: FloatingMenuButtonsProps) {
  return (
    <>
      {/* Note: This container is used to align the wrapper relative to the parent element */}
      <div className={locals.menuButtonsContainer}>
        {/* Note: This wrapper is used to align the elements relative to the top right corner of the container */}
        <div className={locals.menuButtonsWrapper}>
          {status === 'pending' ? (
            <InlineLoading />
          ) : (
            <MoreMenu>
              {!role?.hasScope && (
                <MoreMenuButton
                  onClick={() => addActiveDialog(<EditRoleDialog mode={FORM_MODE.EDIT} formValues={role} />)}
                >
                  {t('in-settings:details.role.editPermissionsButton')}
                </MoreMenuButton>
              )}
              {role?.hasScope && (
                <MoreMenuButton onClick={() => addActiveDialog(<EditRoleScopeDialog roleId={role.id!} />)}>
                  {t('in-settings:details.role.editAsGroupButton')}
                </MoreMenuButton>
              )}
            </MoreMenu>
          )}
        </div>
      </div>
    </>
  );
}
