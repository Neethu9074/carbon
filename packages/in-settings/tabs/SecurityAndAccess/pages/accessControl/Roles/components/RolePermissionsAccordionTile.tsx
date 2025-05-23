/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import { Accordion, AccordionItem, Layer, Stack, Tile } from '@instana/carbon';
import { Spacer, Typography } from '@instana/components';

import {
  AddPermissionItemsFunction,
  PermissionMap
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/hooks/usePermissionCount';
import { RoleDetailsWithPermissions } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import PermissionList from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/PermissionList';
import { AreaPermission, Capability, LimitedAccessScope, LimitedAccessScopeType } from 'in-stores/permission';
import SpaceBetweenStack from 'in-settings/components/SpaceBetweenStack';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

import locals from './RolePermissionsAccordionTile.mless';

interface RolePermissionAccordionTileProps<T> extends PermissionMap<T> {
  addPermissionItems: AddPermissionItemsFunction;
  role?: RoleDetailsWithPermissions;
  showHeader?: boolean;
  status: FetchStatus;
}

export default function RolePermissionsAccordionTile<T>({
  addPermissionItems,
  availablePermissions,
  enabledPermissions,
  role,
  showHeader,
  status
}: RolePermissionAccordionTileProps<T>) {
  const { permissions } = role ?? {};

  return (
    <Tile>
      {!showHeader && (
        <>
          <SpaceBetweenStack>
            <Typography variant="heading-200" component="h4">
              {t('in-settings:details.role.permissionsTitle', {
                actual: enabledPermissions,
                count: availablePermissions
              })}
            </Typography>
          </SpaceBetweenStack>
          <Spacer vertical="normal" />
        </>
      )}
      <Layer level={0} className={locals.accordionBorderBox}>
        <Accordion>
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_EUM_APPLICATIONS,
              Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.websiteSectionTitle')}
            limitingAccessScope={LimitedAccessScope.LIMITED_WEBSITES_SCOPE}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING,
              Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.mobileAppsSectionTitle')}
            limitingAccessScope={LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[AreaPermission.ACCESS_BIZOPS]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.businessMonitoringSectionTitle')}
            limitingAccessScope={LimitedAccessScope.LIMITED_BIZOPS_SCOPE}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_VIEW_TRACE_DETAILS,
              Capability.CAN_CONFIGURE_SERVICE_MAPPING,
              Capability.CAN_CONFIGURE_APPLICATIONS,
              Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS,
              Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.applicationsSectionTitle')}
            limitingAccessScope={LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              LimitedAccessScope.LIMITED_KUBERNETES_SCOPE,
              LimitedAccessScope.LIMITED_NUTANIX_SCOPE,
              LimitedAccessScope.LIMITED_OPENSTACK_SCOPE,
              LimitedAccessScope.LIMITED_PCF_SCOPE,
              LimitedAccessScope.LIMITED_PHMC_SCOPE,
              LimitedAccessScope.LIMITED_POWERVC_SCOPE,
              LimitedAccessScope.LIMITED_SAP_SCOPE,
              LimitedAccessScope.LIMITED_VSPHERE_SCOPE,
              LimitedAccessScope.LIMITED_ZHMC_SCOPE
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.platformsSectionTitle')}
            reversed
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS,
              Capability.CAN_CREATE_HEAP_DUMP,
              Capability.CAN_CREATE_THREAD_DUMP
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.infrastructureSectionTitle')}
            limitingAccessScope={LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS,
              Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS,
              Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.customDashboardsSectionTitle')}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS,
              Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
              Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD,
              Capability.CAN_DELETE_LOGS,
              Capability.CAN_VIEW_LOGS,
              Capability.CAN_VIEW_LOG_VOLUME
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.logsSectionTitle')}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS,
              Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS,
              Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
              Capability.CAN_CONFIGURE_SYNTHETIC_TESTS,
              Capability.CAN_USE_SYNTHETIC_CREDENTIALS
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.syntheticMonitoringSectionTitle')}
            limitingAccessScope={LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
              Capability.CAN_CONFIGURE_AUTOMATION_POLICIES,
              Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY,
              Capability.CAN_RUN_AUTOMATION_ACTIONS
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.automationSectionTitle')}
            limitingAccessScope={LimitedAccessScope.LIMITED_AUTOMATION_SCOPE}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS,
              Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD,
              Capability.CAN_CONFIGURE_INTEGRATIONS,
              Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS,
              Capability.CAN_MANUALLY_CLOSE_ISSUE
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.eventsAndAlertsSectionTitle')}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT,
              Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS,
              Capability.CAN_CONFIGURE_RELEASES,
              Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.globalFunctionsSectionTitle')}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_AGENTS,
              Capability.CAN_CONFIGURE_AGENT_RUN_MODE,
              Capability.CAN_INSTALL_NEW_AGENTS
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.agentDeploymentSectionTitle')}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_API_TOKENS,
              Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS,
              Capability.CAN_CONFIGURE_SESSION_SETTINGS,
              Capability.CAN_CONFIGURE_TEAMS,
              Capability.CAN_VIEW_AUDIT_LOG
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.accessControlSectionTitle')}
            status={status}
          />
        </Accordion>
      </Layer>
    </Tile>
  );
}

interface PermissionItemTitleProps {
  name: string;
  info: string;
}

function PermissionItemTitle({ name, info }: PermissionItemTitleProps) {
  return (
    <Stack orientation="vertical" as="span" gap="var(--cds-spacing-02)" className={locals.permissionItemTitle}>
      <Typography variant="body-regular" component="span">
        {name}
      </Typography>
      <Typography variant="body-regular" component="span">
        {info}
      </Typography>
    </Stack>
  );
}

interface PermissionAccordionItemProps
  extends Pick<Parameters<typeof PermissionList>[0], 'availablePermissions' | 'enabledPermissions'> {
  /**
   * This callback function will be used to update references of actual enabled
   * and available permissions, in order to show correct amount of permissions
   * in the headline of the tile.
   **/
  addPermissionItems: AddPermissionItemsFunction;
  label: string;
  limitingAccessScope?: LimitedAccessScopeType;
  /**
   * Permissions have a reverse logic and count as set if the corresponding
   * LIMITED_ permission is NOT set. This option reflects the counting logic
   * accordingly.
   */
  reversed?: boolean;
  status: FetchStatus;
}

function PermissionAccordionItem({
  addPermissionItems,
  availablePermissions,
  enabledPermissions,
  label,
  limitingAccessScope,
  reversed,
  status
}: PermissionAccordionItemProps) {
  const actualEnabledPermissions = availablePermissions.filter(permission => {
    if (reversed) return !enabledPermissions?.includes(permission);

    return enabledPermissions?.includes(permission);
  });

  const enabledPermissionsCount = actualEnabledPermissions.length;
  const availablePermissionsCount = availablePermissions.length;

  useEffect(
    // As soon as the amount of available or enabled permissions has changed, we
    // need to update the permission references in order to update the counter.
    () => addPermissionItems(availablePermissions, actualEnabledPermissions),
    // We only need to check for the array length in dep-array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [availablePermissions.length, actualEnabledPermissions.length, addPermissionItems]
  );

  return (
    <AccordionItem
      title={
        <PermissionItemTitle
          name={label}
          info={t('in-settings:details.role.permissionCount', {
            actual: enabledPermissionsCount,
            count: availablePermissionsCount
          })}
        />
      }
    >
      <Layer level={1}>
        <PermissionList
          hasAccessPermission={limitingAccessScope && !enabledPermissions?.includes(limitingAccessScope)}
          limitingAccessScope={limitingAccessScope}
          availablePermissions={availablePermissions}
          enabledPermissions={actualEnabledPermissions}
          status={status}
        />
      </Layer>
    </AccordionItem>
  );
}
