/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import {
  CarbonAccordion,
  CarbonAccordionItem,
  CarbonColumn,
  CarbonGrid,
  CarbonLayer,
  CarbonSearch,
  CarbonStack,
  CarbonTile,
  MoreMenu,
  MoreMenuButton,
  Spacer,
  Typography
} from '@instana/components';
import { generateStableHash } from '@instana/utils';

import { containsSomePermissions } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog.utils';
import { ProductAreaPermissionUnion } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/roleForm';
import PermissionList from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/PermissionList';
import EditRoleDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import useChildUniqueItemCount from 'in-settings/tabs/SecurityAndAccess/hooks/useChildUniqueItemCount';
import { AreaPermission, Capability, LimitedAccessScope } from 'in-stores/permission';
import useRoleDetails from 'in-settings/tabs/SecurityAndAccess/hooks/useRoleDetails';
import { FORM_MODE } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './RoleDetails.mless';

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

export default function RoleDetails() {
  const [{ availablePermissions, enabledPermissions }, addPermissionItems, resetPermissionItems] = usePermissionCount();
  const { id: roleId } = useParams<{ id: string }>();
  const [apiRole] = useRoleDetails({ id: roleId });
  const { name, permissions } = apiRole ?? {};

  // We must reset the permission items if the permissions array has changed;
  // for example after editing the permissions of a role.
  useEffect(resetPermissionItems, [resetPermissionItems, generateStableHash(permissions)]);

  return (
    <CarbonGrid fullWidth>
      <CarbonColumn sm="100%">
        <Typography variant="heading-100" noMargin>
          {t('in-settings:details.role.title')}
        </Typography>
        <Typography variant="heading-300" component="h3">
          {name}
        </Typography>
      </CarbonColumn>
      <CarbonColumn md={8}>
        <CarbonTile>
          <CarbonStack orientation="horizontal" className={locals.spaceBetweenStack}>
            <Typography variant="heading-200" component="h4">
              {t('in-settings:details.role.permissionsTitle', {
                actual: enabledPermissions,
                count: availablePermissions
              })}
            </Typography>
            <MoreMenu>
              <MoreMenuButton
                onClick={() => addActiveDialog(<EditRoleDialog mode={FORM_MODE.EDIT} formValues={apiRole} />)}
              >
                {t('in-settings:details.role.editPermissionsButton')}
              </MoreMenuButton>
            </MoreMenu>
          </CarbonStack>
          <Spacer vertical="normal" />
          <CarbonLayer level={0} className={locals.accordionBorderBox}>
            <CarbonAccordion>
              <PermissionAccordionItem
                availablePermissions={[
                  LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
                  Capability.CAN_CONFIGURE_EUM_APPLICATIONS,
                  Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.websiteSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
                  Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING,
                  Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.mobileAppsSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[LimitedAccessScope.LIMITED_BIZOPS_SCOPE, AreaPermission.ACCESS_BIZOPS]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.businessMonitoringSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
                  Capability.CAN_VIEW_TRACE_DETAILS,
                  Capability.CAN_CONFIGURE_SERVICE_MAPPING,
                  Capability.CAN_CONFIGURE_APPLICATIONS,
                  Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS,
                  Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.applicationsSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  ProductArea.PCF,
                  ProductArea.PHMC,
                  ProductArea.POWERVC,
                  ProductArea.OPENSTACK,
                  ProductArea.KUBERNETES,
                  ProductArea.NUTANIX,
                  ProductArea.SAP,
                  ProductArea.VSPHERE
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.platformsSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
                  Capability.CAN_CREATE_HEAP_DUMP,
                  Capability.CAN_CREATE_THREAD_DUMP,
                  Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.infrastructureSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS,
                  Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS,
                  Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.customDashboardsSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  Capability.CAN_VIEW_LOGS,
                  Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
                  Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
                  Capability.CAN_DELETE_LOGS,
                  Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS,
                  Capability.CAN_VIEW_LOG_VOLUME,
                  Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.logsSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE,
                  Capability.CAN_CONFIGURE_SYNTHETIC_TESTS,
                  Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS,
                  Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
                  Capability.CAN_USE_SYNTHETIC_CREDENTIALS,
                  Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS
                ]}
                enabledPermissions={
                  // In order to make sure we only show a single item for the
                  // view-permission, we ensure that LIMITED_SYNTHETICS_SCOPE
                  // is available if any view-permission is set and map this
                  // specific permission to locale text.
                  permissions &&
                  containsSomePermissions(permissions, [
                    LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE,
                    Capability.CAN_VIEW_SYNTHETIC_LOCATIONS,
                    Capability.CAN_VIEW_SYNTHETIC_TESTS,
                    Capability.CAN_VIEW_SYNTHETIC_TESTS,
                    Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS
                  ])
                    ? [...permissions, LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]
                    : permissions
                }
                label={t('in-settings:dialogs.role.syntheticMonitoringSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  LimitedAccessScope.LIMITED_AUTOMATION_SCOPE,
                  Capability.CAN_RUN_AUTOMATION_ACTIONS,
                  Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
                  Capability.CAN_CONFIGURE_AUTOMATION_POLICIES,
                  Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.automationSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  Capability.CAN_CONFIGURE_INTEGRATIONS,
                  Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS,
                  Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS,
                  Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD,
                  Capability.CAN_MANUALLY_CLOSE_ISSUE
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.eventsAndAlertsSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS,
                  Capability.CAN_CONFIGURE_RELEASES,
                  Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION,
                  Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.globalFunctionsSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  Capability.CAN_INSTALL_NEW_AGENTS,
                  Capability.CAN_CONFIGURE_AGENTS,
                  Capability.CAN_CONFIGURE_AGENT_RUN_MODE,
                  Capability.CAN_CONFIGURE_AGENT_RUN_MODE
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.agentDeploymentSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
              <PermissionAccordionItem
                availablePermissions={[
                  Capability.CAN_CONFIGURE_TEAMS,
                  Capability.CAN_CONFIGURE_API_TOKENS,
                  Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS,
                  Capability.CAN_VIEW_AUDIT_LOG,
                  Capability.CAN_CONFIGURE_SESSION_SETTINGS
                ]}
                enabledPermissions={permissions}
                label={t('in-settings:dialogs.role.accessControlSectionTitle')}
                addPermissionItems={addPermissionItems}
              />
            </CarbonAccordion>
          </CarbonLayer>
        </CarbonTile>
      </CarbonColumn>
      <CarbonColumn md={8}>
        <CarbonTile>
          <CarbonStack orientation="horizontal" className={locals.spaceBetweenStack}>
            <Typography variant="heading-200" component="h4">
              {t('in-settings:details.role.usersTitle', { actual: '-', count: '-' })}
            </Typography>

            <CarbonStack orientation="horizontal" className={locals.spaceBetweenStack}>
              <CarbonSearch
                closeButtonLabelText={t('in-settings:details.role.clearSearchButton')}
                id="role-member-search"
                labelText={t('in-settings:details.role.userSearchLabel')}
                placeholder={t('in-settings:details.role.userSearchPlaceholder')}
                role="searchbox"
                size="md"
                type="text"
              />
              <MoreMenu>
                <MoreMenuButton>{t('in-settings:details.role.addUsersButton')}</MoreMenuButton>
              </MoreMenu>
            </CarbonStack>
          </CarbonStack>
          <Spacer vertical="normal" />
        </CarbonTile>
      </CarbonColumn>
    </CarbonGrid>
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
}

function PermissionAccordionItem({
  label,
  availablePermissions,
  enabledPermissions,
  addPermissionItems
}: PermissionAccordionItemProps) {
  const actualEnabledPermissions = availablePermissions.filter(permission => enabledPermissions?.includes(permission));
  const actual = actualEnabledPermissions.length;
  const count = availablePermissions.length;

  useEffect(
    // As soon as the amount of available or enabled permissions has changed, we
    // need to update the permission references in order to update the counter.
    () => addPermissionItems(availablePermissions, actualEnabledPermissions),
    // We only need to check for the array length in dep-array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actualEnabledPermissions.length, availablePermissions.length, addPermissionItems]
  );

  return (
    <CarbonAccordionItem
      title={
        <PermissionItemTitle name={label} info={t('in-settings:details.role.permissionCount', { actual, count })} />
      }
    >
      <CarbonLayer level={1}>
        <PermissionList availablePermissions={availablePermissions} enabledPermissions={enabledPermissions} />
      </CarbonLayer>
    </CarbonAccordionItem>
  );
}
