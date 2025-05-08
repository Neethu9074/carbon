/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import {
  CarbonAccordion,
  CarbonAccordionItem,
  CarbonInlineLoading,
  CarbonLayer,
  CarbonStack,
  CarbonTile,
  MoreMenu,
  MoreMenuButton,
  Spacer,
  Typography
} from '@instana/components';
import { generateStableHash } from '@instana/utils';

import {
  ProductAreaPermissionUnion,
  RoleDetailsWithPermissions
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import EditRoleDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog';
import PermissionList from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/PermissionList';
import useChildUniqueItemCount from 'in-settings/tabs/SecurityAndAccess/hooks/useChildUniqueItemCount';
import { AreaPermission, Capability, LimitedAccessScope } from 'in-stores/permission';
import { FORM_MODE } from 'in-settings/components/MapFormProvider/MapFormProvider';
import SpaceBetweenStack from 'in-settings/components/SpaceBetweenStack';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

import locals from './RolePermissionsAccordionTile.mless';

interface PermissionMap<T> {
  availablePermissions: T;
  enabledPermissions: T;
}

type AddPermissionItemsFunction = (
  availablePermissions: Array<ProductAreaPermissionUnion>,
  enabledPermissions: Array<ProductAreaPermissionUnion>
) => void;
type ResetPermissionItemsFunction = () => void;

/**
 * In order to automatically align amount of permissions with the permissions
 * within the accordion items, we maintain a specific state that will be
 * updated by the PermissionAccordionItem.
 **/
function usePermissionCount(): [PermissionMap<number>, AddPermissionItemsFunction, ResetPermissionItemsFunction] {
  const [availablePermissions, addAvailablePermissionItems, resetAvailablePermissionItems] =
    useChildUniqueItemCount<ProductAreaPermissionUnion>();
  const [enabledPermissions, addEnabledPermissionItems, resetEnabledPermissionItems] =
    useChildUniqueItemCount<ProductAreaPermissionUnion>();

  function addPermissionItems(
    availablePermissions: Array<ProductAreaPermissionUnion>,
    enabledPermissions: Array<ProductAreaPermissionUnion>
  ) {
    addAvailablePermissionItems(availablePermissions);
    addEnabledPermissionItems(enabledPermissions);
  }

  function resetPermissionItems() {
    resetAvailablePermissionItems();
    resetEnabledPermissionItems();
  }

  return [
    {
      availablePermissions,
      enabledPermissions
    },
    addPermissionItems,
    resetPermissionItems
  ];
}

interface RolePermissionAccordionTileProps {
  role?: RoleDetailsWithPermissions;
  status: FetchStatus;
}

export default function RolePermissionsAccordionTile({ role, status }: RolePermissionAccordionTileProps) {
  const { permissions } = role ?? {};
  const [{ availablePermissions, enabledPermissions }, addPermissionItems, resetPermissionItems] = usePermissionCount();

  // We must reset the permission items if the permissions array has changed;
  // for example after editing the permissions of a role.
  useEffect(resetPermissionItems, [resetPermissionItems, generateStableHash(permissions)]);

  return (
    <CarbonTile>
      <SpaceBetweenStack>
        <Typography variant="heading-200" component="h4">
          {t('in-settings:details.role.permissionsTitle', {
            actual: enabledPermissions,
            count: availablePermissions
          })}
        </Typography>
        {status === 'pending' ? (
          <CarbonInlineLoading />
        ) : (
          <MoreMenu>
            <MoreMenuButton onClick={() => addActiveDialog(<EditRoleDialog mode={FORM_MODE.EDIT} formValues={role} />)}>
              {t('in-settings:details.role.editPermissionsButton')}
            </MoreMenuButton>
          </MoreMenu>
        )}
      </SpaceBetweenStack>
      <Spacer vertical="normal" />
      <CarbonLayer level={0} className={locals.accordionBorderBox}>
        <CarbonAccordion>
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[
              Capability.CAN_CONFIGURE_EUM_APPLICATIONS,
              Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS
            ]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.websiteSectionTitle')}
            limitingPermissions={[LimitedAccessScope.LIMITED_WEBSITES_SCOPE]}
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
            limitingPermissions={[LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE]}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[AreaPermission.ACCESS_BIZOPS]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.businessMonitoringSectionTitle')}
            limitingPermissions={[LimitedAccessScope.LIMITED_BIZOPS_SCOPE]}
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
            limitingPermissions={[LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE]}
            status={status}
          />
          <PermissionAccordionItem
            addPermissionItems={addPermissionItems}
            availablePermissions={[]}
            enabledPermissions={permissions}
            label={t('in-settings:dialogs.role.platformsSectionTitle')}
            limitingPermissions={[
              LimitedAccessScope.LIMITED_KUBERNETES_SCOPE,
              LimitedAccessScope.LIMITED_NUTANIX_SCOPE,
              LimitedAccessScope.LIMITED_OPENSTACK_SCOPE,
              LimitedAccessScope.LIMITED_PCF_SCOPE,
              LimitedAccessScope.LIMITED_PHMC_SCOPE,
              LimitedAccessScope.LIMITED_POWERVC_SCOPE,
              LimitedAccessScope.LIMITED_SAP_SCOPE,
              LimitedAccessScope.LIMITED_VSPHERE_SCOPE
            ]}
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
            limitingPermissions={[LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE]}
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
            limitingPermissions={[LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]}
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
            limitingPermissions={[LimitedAccessScope.LIMITED_AUTOMATION_SCOPE]}
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
        </CarbonAccordion>
      </CarbonLayer>
    </CarbonTile>
  );
}

interface PermissionItemTitleProps {
  name: string;
  info: string;
}

function PermissionItemTitle({ name, info }: PermissionItemTitleProps) {
  return (
    <CarbonStack orientation="vertical" as="span" gap="var(--cds-spacing-02)" className={locals.permissionItemTitle}>
      <Typography variant="body-regular" component="span">
        {name}
      </Typography>
      <Typography variant="body-regular" component="span">
        {info}
      </Typography>
    </CarbonStack>
  );
}

interface PermissionAccordionItemProps
  extends Pick<Parameters<typeof PermissionList>[0], 'availablePermissions' | 'enabledPermissions'> {
  label: string;
  /**
   * This callback function will be used to update references of actual enabled
   * and available permissions, in order to show correct amount of permissions
   * in the headline of the tile.
   **/
  addPermissionItems: AddPermissionItemsFunction;
  limitingPermissions?: ProductAreaPermissionUnion[];
  status: FetchStatus;
}

function PermissionAccordionItem({
  addPermissionItems,
  availablePermissions,
  enabledPermissions,
  label,
  limitingPermissions = [],
  status
}: PermissionAccordionItemProps) {
  const availablePermissionsWithLimiting = [...availablePermissions, ...limitingPermissions];
  const actualEnabledPermissions = availablePermissionsWithLimiting.filter(permission =>
    enabledPermissions?.includes(permission)
  );

  // To correctly record the absence of limiting permissions, we invert the
  // logic and add or remove them manually from the permission items.
  const limitingPermissionsToAdd = limitingPermissions.filter(
    limitingPermission => !actualEnabledPermissions.includes(limitingPermission)
  );
  const enabledPermissionsWithLimiting = [
    ...actualEnabledPermissions.filter(permission => !limitingPermissions.includes(permission)),
    ...limitingPermissionsToAdd
  ];

  const actual = enabledPermissionsWithLimiting.length;
  const count = availablePermissionsWithLimiting.length;

  useEffect(
    // As soon as the amount of available or enabled permissions has changed, we
    // need to update the permission references in order to update the counter.
    () => addPermissionItems(availablePermissionsWithLimiting, enabledPermissionsWithLimiting),
    // We only need to check for the array length in dep-array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [availablePermissionsWithLimiting.length, enabledPermissionsWithLimiting.length, addPermissionItems]
  );

  return (
    <CarbonAccordionItem
      title={
        <PermissionItemTitle name={label} info={t('in-settings:details.role.permissionCount', { actual, count })} />
      }
    >
      <CarbonLayer level={1}>
        <PermissionList
          availablePermissions={availablePermissionsWithLimiting}
          enabledPermissions={enabledPermissionsWithLimiting}
          status={status}
        />
      </CarbonLayer>
    </CarbonAccordionItem>
  );
}
