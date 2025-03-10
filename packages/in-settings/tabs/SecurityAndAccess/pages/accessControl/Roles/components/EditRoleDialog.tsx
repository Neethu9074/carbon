/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import {
  CarbonCheckbox,
  CarbonCheckboxGroup,
  CarbonModal,
  CarbonTextInput,
  Message,
  CarbonToggle,
  Typography,
  ValidationBlock
} from '@instana/components';

import {
  containsAllPermissions,
  containsSomePermissions,
  togglePermissions
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog.utils';
import {
  createRoleForm,
  DefaultRoleFormFieldValues,
  RoleFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/roleForm';
import MapFormProvider, { FormMode, useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { AreaPermission, Capability, LimitedAccessScope } from 'in-stores/permission';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { close } from 'in-components/DialogPresenter/store';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './EditRoleDialog.mless';

const ROLE_FORM_ID = 'rbac-role-form';

interface EditRoleDialogProps {
  mode: FormMode;
  formValues?: DefaultRoleFormFieldValues;
}

export default function EditRoleDialog({ mode, formValues }: EditRoleDialogProps) {
  const [form, setForm] = useState(createRoleForm(formValues));

  const navItems = [
    {
      content: <GeneralSection />,
      label: t('in-settings:dialogs.role.generalSectionTitle'),
      scrollId: 'general-section',
      title: undefined,
      valid: !form.touched || form.get('name').valid
    },
    {
      content: <WebsitesSection />,
      label: t('in-settings:dialogs.role.websiteSectionTitle'),
      scrollId: 'websites-section',
      title: t('in-settings:dialogs.role.websiteSectionTitle'),
      valid: true
    },
    {
      content: <MobileAppsSection />,
      label: t('in-settings:dialogs.role.mobileAppsSectionTitle'),
      scrollId: 'mobile-apps-section',
      title: t('in-settings:dialogs.role.mobileAppsSectionTitle'),
      valid: true
    },
    {
      content: <BusinessMonitoringSection />,
      label: t('in-settings:dialogs.role.businessMonitoringSectionTitle'),
      scrollId: 'business-monitoring-section',
      title: t('in-settings:dialogs.role.businessMonitoringSectionTitle'),
      valid: true
    },
    {
      content: <ApplicationsSection />,
      label: t('in-settings:dialogs.role.applicationsSectionTitle'),
      scrollId: 'applications-section',
      title: t('in-settings:dialogs.role.applicationsSectionTitle'),
      valid: true
    },
    {
      content: <PlatformsSection />,
      label: t('in-settings:dialogs.role.platformsSectionTitle'),
      scrollId: 'platforms-section',
      title: t('in-settings:dialogs.role.platformsSectionTitle'),
      valid: true
    },
    {
      content: <InfrastructureSection />,
      label: t('in-settings:dialogs.role.infrastructureSectionTitle'),
      scrollId: 'infrastructure-section',
      title: t('in-settings:dialogs.role.infrastructureSectionTitle'),
      valid: true
    },
    {
      content: <CustomDashboardsSection />,
      label: t('in-settings:dialogs.role.customDashboardsSectionTitle'),
      scrollId: 'custom-dashboards-section',
      title: t('in-settings:dialogs.role.customDashboardsSectionTitle'),
      valid: true
    },
    {
      content: <LogsSection />,
      label: t('in-settings:dialogs.role.logsSectionTitle'),
      scrollId: 'logs-section',
      title: t('in-settings:dialogs.role.logsSectionTitle'),
      valid: true
    },
    {
      content: <SyntheticMonitoringSection />,
      label: t('in-settings:dialogs.role.syntheticMonitoringSectionTitle'),
      scrollId: 'synthetic-monitoring-section',
      title: t('in-settings:dialogs.role.syntheticMonitoringSectionTitle'),
      valid: true
    },
    {
      content: <AutomationSection />,
      label: t('in-settings:dialogs.role.automationSectionTitle'),
      scrollId: 'automation-section',
      title: t('in-settings:dialogs.role.automationSectionTitle'),
      valid: true
    },
    {
      content: <EventsAndAlertsSection />,
      label: t('in-settings:dialogs.role.eventsAndAlertsSectionTitle'),
      scrollId: 'events-and-alerts-section',
      title: t('in-settings:dialogs.role.eventsAndAlertsSectionTitle'),
      valid: true
    },
    {
      content: <GlobalFunctionsSection />,
      label: t('in-settings:dialogs.role.globalFunctionsSectionTitle'),
      scrollId: 'global-functions-section',
      title: t('in-settings:dialogs.role.globalFunctionsSectionTitle'),
      valid: true
    },
    {
      content: <AgentDeploymentSection />,
      label: t('in-settings:dialogs.role.agentDeploymentSectionTitle'),
      scrollId: 'agent-deployment-section',
      title: t('in-settings:dialogs.role.agentDeploymentSectionTitle'),
      valid: true
    },
    {
      content: <AccessControlSection />,
      label: t('in-settings:dialogs.role.accessControlSectionTitle'),
      scrollId: 'access-control-section',
      title: t('in-settings:dialogs.role.accessControlSectionTitle'),
      valid: true
    }
  ];

  return (
    <MapFormProvider id={ROLE_FORM_ID} form={form} mode={mode} updateForm={setForm}>
      <CarbonModal
        modalHeading={t('in-settings:dialogs.role.title')}
        onRequestClose={close}
        onRequestSubmit={noop}
        onSecondarySubmit={close}
        open
        primaryButtonDisabled={!form.hierarchyTouched || !form.hierarchyValid}
        primaryButtonText={t('in-settings:tabs.save')}
        secondaryButtonText={t('in-settings:tabs.cancel')}
        size="lg"
      >
        <form>
          <StepsContainer navItems={navItems} noDivider />
        </form>
      </CarbonModal>
    </MapFormProvider>
  );
}

function GeneralSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const nameField = form.getIn(['name']);
  const applyToAllUnitsField = form.getIn(['applyToAllUnits']);

  return (
    <>
      <CarbonTextInput
        id="rbac-role-name"
        invalid={form.hierarchyTouched && !nameField.valid}
        invalidText={nameField.messages.map(({ message }, index) => (
          <ValidationBlock key={`validation-message-${index}`}>{message}</ValidationBlock>
        ))}
        labelText={t('in-settings:dialogs.role.nameFieldLabel')}
        maxLength={256}
        onChange={e => updateIn(['name'], nameField.setValue(e.target.value).setTouched(true))}
        required
        type="text"
        value={nameField.value}
      />
      <Typography variant="body-regular">{t('in-settings:dialogs.role.generalDescription')}</Typography>
      <CarbonCheckboxGroup legendText={t('in-settings:dialogs.role.roleDefinitionPerUnitLegendText')}>
        <CarbonCheckbox
          checked={applyToAllUnitsField.value}
          id="rbac-role-apply-to-all-units"
          labelText={t('in-settings:dialogs.role.roleDefinitionPerUnitCheckboxLabel')}
          onChange={(_e, { checked }) =>
            updateIn(['applyToAllUnits'], applyToAllUnitsField.setValue(checked).setTouched(true))
          }
        />
      </CarbonCheckboxGroup>
    </>
  );
}

function WebsitesSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <>
      <CarbonToggle
        toggled={containsSomePermissions(permissionsField.value, [LimitedAccessScope.LIMITED_WEBSITES_SCOPE])}
        id="rbac-role-website-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.websiteAccessToggleLabel')}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [LimitedAccessScope.LIMITED_WEBSITES_SCOPE],
            permissionsToRemoveOnDisabled: [
              LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
              Capability.CAN_CONFIGURE_EUM_APPLICATIONS,
              Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS
            ],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
        size="sm"
      />
      <CarbonCheckboxGroup
        legendText={t('in-settings:dialogs.role.websiteSectionCheckboxGroupLegendText')}
        className={locals.checkboxGroup}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_EUM_APPLICATIONS])}
          id="rbac-role-websites-write-access"
          labelText={t('in-settings:dialogs.role.websiteWriteAccessCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
                Capability.CAN_CONFIGURE_EUM_APPLICATIONS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_EUM_APPLICATIONS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS])}
          id="rbac-role-websites-config-smart-alerts"
          labelText={t('in-settings:dialogs.role.configSmartAlertsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
                Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
    </>
  );
}

function MobileAppsSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <>
      <CarbonToggle
        toggled={containsSomePermissions(permissionsField.value, [LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE])}
        id="rbac-role-mobile-apps-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.mobileAppsAccessToggleLabel')}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE],
            permissionsToRemoveOnDisabled: [
              LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
              Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING,
              Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS
            ],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
        size="sm"
      />
      <CarbonCheckboxGroup
        legendText={t('in-settings:dialogs.role.mobileAppsCheckboxGroupLegendText')}
        className={locals.checkboxGroup}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING])}
          id="rbac-role-mobile-apps-write-access"
          labelText={t('in-settings:dialogs.role.mobileAppsWriteAccessCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
                Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS])}
          id="rbac-role-mobile-apps-config-smart-alerts"
          labelText={t('in-settings:dialogs.role.mobileAppsConfigSmartAlertsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
                Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
    </>
  );
}

function BusinessMonitoringSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <>
      <CarbonToggle
        toggled={containsSomePermissions(permissionsField.value, [LimitedAccessScope.LIMITED_BIZOPS_SCOPE])}
        id="rbac-role-business-monitoring-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.businessMonitoringAccessToggleLabel')}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [LimitedAccessScope.LIMITED_BIZOPS_SCOPE],
            permissionsToRemoveOnDisabled: [LimitedAccessScope.LIMITED_BIZOPS_SCOPE, AreaPermission.ACCESS_BIZOPS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
        size="sm"
      />
      <CarbonCheckboxGroup
        legendText={t('in-settings:dialogs.role.businessMonitoringCheckboxGroupLegendText')}
        className={locals.checkboxGroup}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [AreaPermission.ACCESS_BIZOPS])}
          id="rbac-role-business-manage-and-configure"
          labelText={t('in-settings:dialogs.role.businessMonitoringConfigCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [LimitedAccessScope.LIMITED_BIZOPS_SCOPE, AreaPermission.ACCESS_BIZOPS],
              permissionsToRemoveOnDisabled: [AreaPermission.ACCESS_BIZOPS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
    </>
  );
}

function ApplicationsSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <>
      <CarbonToggle
        toggled={containsSomePermissions(permissionsField.value, [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE])}
        id="rbac-role-applications-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.applicationsAccessToggleLabel')}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE],
            permissionsToRemoveOnDisabled: [
              LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
              Capability.CAN_VIEW_TRACE_DETAILS,
              Capability.CAN_CONFIGURE_SERVICE_MAPPING,
              Capability.CAN_CONFIGURE_APPLICATIONS,
              Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS,
              Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS
            ],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
        size="sm"
      />
      <CarbonCheckboxGroup
        legendText={t('in-settings:dialogs.role.applicationsCheckboxGroupLegendText')}
        className={locals.checkboxGroup}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_VIEW_TRACE_DETAILS])}
          id="rbac-role-applications-view-trace-details"
          labelText={t('in-settings:dialogs.role.applicationsTraceDetailsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
                Capability.CAN_VIEW_TRACE_DETAILS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_VIEW_TRACE_DETAILS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_SERVICE_MAPPING])}
          id="rbac-role-applications-config-service-mapping"
          labelText={t('in-settings:dialogs.role.applicationsConfigServiceMappingCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
                Capability.CAN_CONFIGURE_SERVICE_MAPPING
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_SERVICE_MAPPING],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_APPLICATIONS])}
          id="rbac-role-applications-write-access"
          labelText={t('in-settings:dialogs.role.applicationsWriteAccessCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
                Capability.CAN_CONFIGURE_APPLICATIONS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_APPLICATIONS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS])}
          id="rbac-role-applications-config-smart-alerts"
          labelText={t('in-settings:dialogs.role.applicationsConfigSmartAlertsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
                Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckboxGroup
          legendText=""
          helperText={t('in-settings:dialogs.role.applicationsConfigGlobalSmartAlertsHelpText')}
        >
          <CarbonCheckbox
            checked={containsSomePermissions(permissionsField.value, [
              Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS
            ])}
            id="rbac-role-applications-config-global-smart-alerts"
            labelText={t('in-settings:dialogs.role.applicationsConfigGlobalSmartAlertsCheckboxLabel')}
            onChange={(_e, { checked: enabled }) => {
              const updatedPermissions = togglePermissions({
                currentPermissions: permissionsField.value,
                permissionsToAddOnEnabled: [
                  LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
                  Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS
                ],
                permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS],
                enabled
              });
              updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
            }}
          />
        </CarbonCheckboxGroup>
      </CarbonCheckboxGroup>
    </>
  );
}

function PlatformsSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <CarbonCheckboxGroup
      legendText={t('in-settings:dialogs.role.platformSectionCheckboxGroupLegendText')}
      className={locals.checkboxGroup}
    >
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [ProductArea.PCF])}
        id="rbac-role-platforms-cloud-foundry"
        labelText={t('in-settings:dialogs.role.platformsCloudFoundryCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [ProductArea.PCF],
            permissionsToRemoveOnDisabled: [ProductArea.PCF],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [ProductArea.PHMC])}
        id="rbac-role-platforms-power-hmc"
        labelText={t('in-settings:dialogs.role.platformsPowerHMccCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [ProductArea.PHMC],
            permissionsToRemoveOnDisabled: [ProductArea.PHMC],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [ProductArea.POWERVC])}
        id="rbac-role-platforms-powervc"
        labelText={t('in-settings:dialogs.role.platformsPowerVCCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [ProductArea.POWERVC],
            permissionsToRemoveOnDisabled: [ProductArea.POWERVC],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [ProductArea.OPENSTACK])}
        id="rbac-role-platforms-openstack"
        labelText={t('in-settings:dialogs.role.platformsOpenStackCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [ProductArea.OPENSTACK],
            permissionsToRemoveOnDisabled: [ProductArea.OPENSTACK],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [ProductArea.KUBERNETES])}
        id="rbac-role-platforms-kubernetes"
        labelText={t('in-settings:dialogs.role.platformsKubernetesCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [ProductArea.KUBERNETES],
            permissionsToRemoveOnDisabled: [ProductArea.KUBERNETES],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [ProductArea.NUTANIX])}
        id="rbac-role-platforms-nutanix"
        labelText={t('in-settings:dialogs.role.platformsNutanixCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [ProductArea.NUTANIX],
            permissionsToRemoveOnDisabled: [ProductArea.NUTANIX],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [ProductArea.SAP])}
        id="rbac-role-platforms-sap"
        labelText={t('in-settings:dialogs.role.platformsSAPCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [ProductArea.SAP],
            permissionsToRemoveOnDisabled: [ProductArea.SAP],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [ProductArea.VSPHERE])}
        id="rbac-role-platforms-vsphere"
        labelText={t('in-settings:dialogs.role.platformsvSphereCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [ProductArea.VSPHERE],
            permissionsToRemoveOnDisabled: [ProductArea.VSPHERE],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
    </CarbonCheckboxGroup>
  );
}

function InfrastructureSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <>
      <CarbonToggle
        toggled={containsSomePermissions(permissionsField.value, [LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE])}
        id="rbac-role-infrastructure-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.infrastructureAccessToggleLabel')}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE],
            permissionsToRemoveOnDisabled: [
              AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE,
              LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
              Capability.CAN_CREATE_HEAP_DUMP,
              Capability.CAN_CREATE_THREAD_DUMP,
              Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS
            ],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
        size="sm"
      />
      <CarbonCheckboxGroup
        legendText=""
        className={classNames([locals.checkboxGroup, locals.checkboxGroupWithoutLegendText])}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE])}
          id="rbac-role-infrastructure-view-analyze"
          labelText={t('in-settings:dialogs.role.infrastructureViewAnalyzeCheckboxLabel')}
          helperText={t('in-settings:dialogs.role.infrastructureViewAnalyzeCheckboxLegendText')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
                AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE
              ],
              permissionsToRemoveOnDisabled: [AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CREATE_HEAP_DUMP])}
          id="rbac-role-infrastructure-create-heap-dump"
          labelText={t('in-settings:dialogs.role.infrastructureCreateHeapDumpCheckboxLabel')}
          helperText={t('in-settings:dialogs.role.infrastructureCreateHeapDumpCheckboxLegendText')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
                Capability.CAN_CREATE_HEAP_DUMP
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CREATE_HEAP_DUMP],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CREATE_THREAD_DUMP])}
          id="rbac-role-infrastructure-create-thread-dump"
          labelText={t('in-settings:dialogs.role.infrastructureCreateThreadDumpCheckboxLabel')}
          helperText={t('in-settings:dialogs.role.infrastructureCreateThreadDumpCheckbboxLegendText')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
                Capability.CAN_CREATE_THREAD_DUMP
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CREATE_THREAD_DUMP],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [
            Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS
          ])}
          id="rbac-role-infrastructure-config-global-smart-alerts"
          labelText={t('in-settings:dialogs.role.infrastructureConfigGlobalSmartAlertsCheckboxLabel')}
          helperText={t('in-settings:dialogs.role.infrastructureConfigGlobalSmartAlertsCheckboxLegendText')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
                Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
    </>
  );
}

function CustomDashboardsSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <CarbonCheckboxGroup
      legendText=""
      className={classNames([locals.checkboxGroup, locals.checkboxGroupWithoutLegendText])}
    >
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS])}
        id="rbac-role-custom-dashboards-share-public"
        labelText={t('in-settings:dialogs.role.customDashboardsSharePublicCheckboxLabel')}
        helperText={t('in-settings:dialogs.role.customDashboardsSharePublickCheckboxLegendText')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [
          Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS
        ])}
        id="rbac-role-custom-dashboards-manage-all"
        labelText={t('in-settings:dialogs.role.customDashboardsManageAllCheckboxLabel')}
        helperText={t('in-settings:dialogs.role.customDashboardsManageAllCheckboxLegendText')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS],
            permissionsToRemoveOnDisabled: [Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS])}
        id="rbac-role-custom-dashboard-config-service-level-indicators"
        labelText={t('in-settings:dialogs.role.customDashboardsConfigSliCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
    </CarbonCheckboxGroup>
  );
}

function LogsSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <>
      <CarbonToggle
        toggled={containsSomePermissions(permissionsField.value, [Capability.CAN_VIEW_LOGS])}
        id="rbac-role-logs-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.logsAccessToggleLabel')}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_VIEW_LOGS],
            permissionsToRemoveOnDisabled: [
              Capability.CAN_VIEW_LOGS,
              Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
              Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
              Capability.CAN_DELETE_LOGS,
              Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS,
              Capability.CAN_VIEW_LOG_VOLUME,
              Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD
            ],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
        size="sm"
      />
      <CarbonCheckboxGroup
        legendText={t('in-settings:dialogs.role.logsCheckboxGroupLegendText')}
        className={locals.checkboxGroup}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_LOG_MANAGEMENT])}
          id="rbac-role-logs-management"
          labelText={t('in-settings:dialogs.role.logsManagementCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_CONFIGURE_LOG_MANAGEMENT],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_LOG_MANAGEMENT],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_DELETE_LOGS])}
          id="rbac-role-logs-delete"
          labelText={t('in-settings:dialogs.role.logsDeleteCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_DELETE_LOGS],
              permissionsToRemoveOnDisabled: [Capability.CAN_DELETE_LOGS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS])}
          id="rbac-role-logs-config-global-smart-alerts"
          labelText={t('in-settings:dialogs.role.logsConfigGlobalSmartAlertsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_VIEW_LOG_VOLUME])}
          id="rbac-role-logs-view-volume-report"
          labelText={t('in-settings:dialogs.role.logsViewVolumeReportCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_VIEW_LOG_VOLUME],
              permissionsToRemoveOnDisabled: [Capability.CAN_VIEW_LOG_VOLUME],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD])}
          id="rbac-role-logs-config-retention-period"
          labelText={t('in-settings:dialogs.role.logsConfigRetentionPeriodCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
    </>
  );
}

function SyntheticMonitoringSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  const syntheticsViewPermissions = [
    LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE,
    Capability.CAN_VIEW_SYNTHETIC_LOCATIONS,
    Capability.CAN_VIEW_SYNTHETIC_TESTS,
    Capability.CAN_VIEW_SYNTHETIC_TESTS,
    Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS
  ];
  const hasAllViewPermissions = containsAllPermissions(permissionsField.value, syntheticsViewPermissions);
  const hasSomeViewPermissions = containsSomePermissions(permissionsField.value, syntheticsViewPermissions);
  const showPartialPermissionsWarning = !hasAllViewPermissions && hasSomeViewPermissions;

  return (
    <>
      {showPartialPermissionsWarning && (
        <Message type="warning">{t('in-settings:dialogs.role.syntheticsPartialPermissionsWarning')}</Message>
      )}
      <CarbonToggle
        toggled={hasSomeViewPermissions}
        id="rbac-role-synhetics-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.syntheticsAccessToggleLabel')}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: syntheticsViewPermissions,
            permissionsToRemoveOnDisabled: [
              ...syntheticsViewPermissions,
              Capability.CAN_CONFIGURE_SYNTHETIC_TESTS,
              Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS,
              Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
              Capability.CAN_USE_SYNTHETIC_CREDENTIALS,
              Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS
            ],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
        size="sm"
      />
      <CarbonCheckboxGroup
        legendText={t('in-settings:dialogs.role.syntheticsCheckboxGroupLegendText')}
        className={locals.checkboxGroup}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_SYNTHETIC_TESTS])}
          id="rbac-role-synthetics-write-access"
          labelText={t('in-settings:dialogs.role.syntheticsWriteAccessCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [...syntheticsViewPermissions, Capability.CAN_CONFIGURE_SYNTHETIC_TESTS],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_SYNTHETIC_TESTS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [
            Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS
          ])}
          id="rbac-role-synthetics-config-smart-alerts"
          labelText={t('in-settings:dialogs.role.syntheticsConfigSmartAlertsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                ...syntheticsViewPermissions,
                Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS])}
          id="rbac-role-synthetics-config-locations"
          labelText={t('in-settings:dialogs.role.syntheticsConfigLocationsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [...syntheticsViewPermissions, Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_USE_SYNTHETIC_CREDENTIALS])}
          id="rbac-role-synthetics-use-credentials"
          labelText={t('in-settings:dialogs.role.syntehticsUseCredentialsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [...syntheticsViewPermissions, Capability.CAN_USE_SYNTHETIC_CREDENTIALS],
              permissionsToRemoveOnDisabled: [Capability.CAN_USE_SYNTHETIC_CREDENTIALS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS])}
          id="rbac-role-synthetics-config-credentials"
          labelText={t('in-settings:dialogs.role.syntheticsConfigCredentialsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [...syntheticsViewPermissions, Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
    </>
  );
}

function AutomationSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <>
      <CarbonToggle
        toggled={containsSomePermissions(permissionsField.value, [LimitedAccessScope.LIMITED_AUTOMATION_SCOPE])}
        id="rbac-role-automation-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.automationAccessToggleLabel')}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [LimitedAccessScope.LIMITED_AUTOMATION_SCOPE],
            permissionsToRemoveOnDisabled: [
              LimitedAccessScope.LIMITED_AUTOMATION_SCOPE,
              Capability.CAN_RUN_AUTOMATION_ACTIONS,
              Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
              Capability.CAN_CONFIGURE_AUTOMATION_POLICIES,
              Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY
            ],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
        size="sm"
      />
      <CarbonCheckboxGroup
        legendText={t('in-settings:dialogs.role.automationCheckboxGroupLegendText')}
        className={locals.checkboxGroup}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_RUN_AUTOMATION_ACTIONS])}
          id="rbac-role-automation-run-actions"
          labelText={t('in-settings:dialogs.role.automationRunActionsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_AUTOMATION_SCOPE,
                Capability.CAN_RUN_AUTOMATION_ACTIONS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_RUN_AUTOMATION_ACTIONS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS])}
          id="rbac-role-automation-config-actions"
          labelText={t('in-settings:dialogs.role.automationConfigActionsCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_AUTOMATION_SCOPE,
                Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_AUTOMATION_POLICIES])}
          id="rbac-role-automation-config-policies"
          labelText={t('in-settings:dialogs.role.automationConfigPoliciesCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_AUTOMATION_SCOPE,
                Capability.CAN_CONFIGURE_AUTOMATION_POLICIES
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_AUTOMATION_POLICIES],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY])}
          id="rbac-role-automation-delete-action-history"
          labelText={t('in-settings:dialogs.role.automationDeleteActionHistoryCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [
                LimitedAccessScope.LIMITED_AUTOMATION_SCOPE,
                Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY
              ],
              permissionsToRemoveOnDisabled: [Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
    </>
  );
}

function EventsAndAlertsSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <CarbonCheckboxGroup
      legendText=""
      className={classNames([locals.checkboxGroup, locals.checkboxGroupWithoutLegendText])}
    >
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_INTEGRATIONS])}
        id="rbac-role-events-and-alerts-config-alert-channels"
        labelText={t('in-settings:dialogs.role.eventsAndAlertsConfigAlertChannelsCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_INTEGRATIONS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_INTEGRATIONS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS])}
        id="rbac-role-events-and-alerts-config-events-alerts"
        labelText={t('in-settings:dialogs.role.eventsAndAlertsConfigEventsAlertsCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS])}
        id="rbac-role-events-and-alerts-config-maintenance-windows"
        labelText={t('in-settings:dialogs.role.eventsAndAlertsConfigMaintenanceWindowsCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD])}
        id="rbac-role-events-and-alerts-config-global-alert-payload"
        labelText={t('in-settings:dialogs.role.eventsAndAlertsConfigGlobalSmartAlertPayloadCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_MANUALLY_CLOSE_ISSUE])}
        id="rbac-role-events-and-alerts-manually-close"
        labelText={t('in-settings:dialogs.role.eventsAndAlertsManuallyCloseCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_MANUALLY_CLOSE_ISSUE],
            permissionsToRemoveOnDisabled: [Capability.CAN_MANUALLY_CLOSE_ISSUE],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
    </CarbonCheckboxGroup>
  );
}

function GlobalFunctionsSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <CarbonCheckboxGroup
      legendText=""
      className={classNames([locals.checkboxGroup, locals.checkboxGroupWithoutLegendText])}
    >
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS])}
        id="rbac-role-global-functions-config-personal-api-tokens"
        labelText={t('in-settings:dialogs.role.globalFunctionsConfigPersonalApiTokenCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_RELEASES])}
        id="rbac-role-global-functions-config-releases"
        labelText={t('in-settings:dialogs.role.globalFunctionsConfigReleasesCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_RELEASES],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_RELEASES],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION])}
        id="rbac-role-global-functions-view-billing-info"
        labelText={t('in-settings:dialogs.role.globalFunctionsViewBillingInfoCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION],
            permissionsToRemoveOnDisabled: [Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT])}
        id="rbac-role-global-functions-config-database-management"
        labelText={t('in-settings:dialogs.role.globalFunctionsConfigDbManagementCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
    </CarbonCheckboxGroup>
  );
}

function AgentDeploymentSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <CarbonCheckboxGroup
      legendText=""
      className={classNames([locals.checkboxGroup, locals.checkboxGroupWithoutLegendText])}
    >
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_INSTALL_NEW_AGENTS])}
        id="rbac-role-agent-deployment-install-agents"
        labelText={t('in-settings:dialogs.role.agentDeploymentInstallAgentsCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_INSTALL_NEW_AGENTS],
            permissionsToRemoveOnDisabled: [Capability.CAN_INSTALL_NEW_AGENTS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_AGENTS])}
        id="rbac-role-agent-deployment-config-agents"
        labelText={t('in-settings:dialogs.role.agentDeploymentConfigAgentsCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_AGENTS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_AGENTS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_AGENT_RUN_MODE])}
        id="rbac-role-agent-deployment-config-agent-mode"
        labelText={t('in-settings:dialogs.role.agentDeploymentConfigAgentModeCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_AGENT_RUN_MODE],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_AGENT_RUN_MODE],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
    </CarbonCheckboxGroup>
  );
}

function AccessControlSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <CarbonCheckboxGroup
      legendText=""
      className={classNames([locals.checkboxGroup, locals.checkboxGroupWithoutLegendText])}
    >
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_TEAMS])}
        id="rbac-role-access-control-config-teams"
        labelText={t('in-settings:dialogs.role.accessControlConfigTeamsCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_TEAMS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_TEAMS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />

      <CarbonCheckboxGroup legendText="" helperText={t('in-settings:dialogs.role.accessControlRoleManagementHelpText')}>
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [])}
          id="rbac-role-access-control-role-management"
          labelText={t('in-settings:dialogs.role.accessControlRoleManagementCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [],
              permissionsToRemoveOnDisabled: [],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
      <CarbonCheckboxGroup
        legendText=""
        helperText={t('in-settings:dialogs.role.accessControlTeamScopeManagementHelpText')}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [])}
          id="rbac-role-access-control-team-scope-management"
          labelText={t('in-settings:dialogs.role.accessControlTeamScopeManagementCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [],
              permissionsToRemoveOnDisabled: [],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
      <CarbonCheckboxGroup
        legendText=""
        helperText={t('in-settings:dialogs.role.accessControlConfigApiTokensHelpText')}
      >
        <CarbonCheckbox
          checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_API_TOKENS])}
          id="rbac-role-access-control-config-api-tokens"
          labelText={t('in-settings:dialogs.role.accessControlConfigApiTokensCheckboxLabel')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              currentPermissions: permissionsField.value,
              permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_API_TOKENS],
              permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_API_TOKENS],
              enabled
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS])}
        id="rbac-role-access-control-config-auth-methods"
        labelText={t('in-settings:dialogs.role.accessControlConfigAuthMethodsCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_VIEW_AUDIT_LOG])}
        id="rbac-role-access-control-view-audit-trail"
        labelText={t('in-settings:dialogs.role.accessControlViewAuditTrailCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_VIEW_AUDIT_LOG],
            permissionsToRemoveOnDisabled: [Capability.CAN_VIEW_AUDIT_LOG],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsSomePermissions(permissionsField.value, [Capability.CAN_CONFIGURE_SESSION_SETTINGS])}
        id="rbac-role-access-control-view-token-and-timeout-settings"
        labelText={t('in-settings:dialogs.role.accessControlViewTokenAndTimeoutSettingsCheckboxLabel')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            currentPermissions: permissionsField.value,
            permissionsToAddOnEnabled: [Capability.CAN_CONFIGURE_SESSION_SETTINGS],
            permissionsToRemoveOnDisabled: [Capability.CAN_CONFIGURE_SESSION_SETTINGS],
            enabled
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
    </CarbonCheckboxGroup>
  );
}
