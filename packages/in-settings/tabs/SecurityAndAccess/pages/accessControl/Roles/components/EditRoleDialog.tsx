/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

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
import { ApiRole, CreateRole } from '@instana/types';

import {
  createRoleForm,
  DefaultRoleFormFieldValues,
  RoleFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog.form';
import {
  containsAnyPermission,
  togglePermissions
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog.utils';
import MapFormProvider, {
  FORM_MODE,
  FormMode,
  useMapFormContext
} from 'in-settings/components/MapFormProvider/MapFormProvider';
import { getEntityHref, securityAndAccessAccessControlRoles } from 'in-settings/navigation/paths';
import { AreaPermission, Capability, LimitedAccessScope } from 'in-stores/permission';
import { createRole, updateRole } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CREATED_OBJECT, UPDATED_OBJECT } from 'in-services/util/constants';
import { close as closeModal } from 'in-components/DialogPresenter/store';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { SETTINGS_ROLE_SUBMIT } from 'in-services/tracking/eventNames';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { newOTelPageEnabled } from 'in-services/featureFlags';
import useFormSubmission from 'in-hooks/useFormSubmission';
import useDerivedState from 'in-hooks/useDerivedState';
import { FetchStatus } from 'in-hooks/utils/types';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from './EditRoleDialog.mless';

const ROLE_FORM_ID = 'rbac-role-form';
const ROLE_FORM_ACTIONS = Object.freeze({
  clone: createRole,
  edit: updateRole,
  new: createRole
} as const);

function isNotEditModeOrHasValidId(mode: FormMode, payload: ApiRole | CreateRole): payload is ApiRole {
  const isEditMode = mode === FORM_MODE.EDIT;
  const hasIdProp = 'id' in payload;
  const isValidId = hasIdProp && typeof payload.id === 'string';

  return !isEditMode || isValidId;
}

interface EditRoleDialogProps {
  mode: FormMode;
  formValues?: Partial<DefaultRoleFormFieldValues>;
}

export default function EditRoleDialog({ mode, formValues }: EditRoleDialogProps) {
  const [form, setForm] = useDerivedState(createRoleForm(formValues));
  const [status, submitForm] = useFormSubmission(ROLE_FORM_ACTIONS[mode]);
  const { unstable_trackEvent } = useSegmentTracking();
  const { navigate } = useNavigation();

  function onSubmit() {
    if (!form.hierarchyValid) {
      // In case user clicks on save button and the form is in invalid state we
      // cancel the submission request and set the form to touched in order to
      // show validation messages to the user.
      return setForm(form.setTouched(true));
    }

    const payload = form.toJS();

    if (!isNotEditModeOrHasValidId(mode, payload)) {
      throw new Error('The role ID must be specified for editing.');
    }

    submitForm({
      payload,
      onError: () => {
        addMessage({
          content: t('in-components:error.serverErrorInfo'),
          timeout: seconds.toMillis(6),
          type: 'danger'
        });
      },
      onSuccess: result => {
        const { permissions, ...customData } = payload;
        addMessage({
          title: t('in-settings:components.successTitle'),
          content: t('in-settings:dialogs.role.roleSuccessfullySaved'),
          timeout: seconds.toMillis(4),
          type: 'success'
        });
        unstable_trackEvent(
          mode === FORM_MODE.EDIT ? UPDATED_OBJECT : CREATED_OBJECT,
          { objectType: SETTINGS_ROLE_SUBMIT },
          customData
        );
        if (mode === FORM_MODE.NEW) {
          navigate(parseUrl(getEntityHref(securityAndAccessAccessControlRoles, result.data?.id ?? ''), true));
        }
        closeModal();
      }
    });
  }

  const navItems = [
    {
      content: <GeneralSection status={status} />,
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
      label: newOTelPageEnabled
        ? t('in-settings:dialogs.role.datasourceSectionTitle')
        : t('in-settings:dialogs.role.agentDeploymentSectionTitle'),
      scrollId: 'agent-deployment-section',
      title: newOTelPageEnabled
        ? t('in-settings:dialogs.role.datasourceSectionTitle')
        : t('in-settings:dialogs.role.agentDeploymentSectionTitle'),
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
        modalHeading={t('in-settings:dialogs.role.title', { context: mode })}
        onRequestClose={closeModal}
        onRequestSubmit={onSubmit}
        onSecondarySubmit={closeModal}
        open
        primaryButtonDisabled={status === 'pending'}
        primaryButtonText={t('in-settings:tabs.save')}
        secondaryButtonText={t('in-settings:tabs.cancel')}
        selectorPrimaryFocus="#rbac-role-name"
        size="lg"
      >
        <form>
          <StepsContainer navItems={navItems} noDivider />
        </form>
      </CarbonModal>
    </MapFormProvider>
  );
}

interface SectionProps {
  status?: FetchStatus;
}

function GeneralSection({ status }: SectionProps) {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const nameField = form.getIn(['name']);

  return (
    <>
      {status === 'rejected' && <Message type="error">{t('in-components:error.serverErrorInfo')}</Message>}
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
      {/*
       * Note: Role definition per unit is currently not yet supported on
       * backend which is why we commented the related checkboxes out for now.
       */}
      {/* <CarbonCheckboxGroup legendText={t('in-settings:dialogs.role.roleDefinitionPerUnitLegendText')}> */}
      {/*   <CarbonCheckbox */}
      {/*     checked={applyToAllUnitsField.value} */}
      {/*     id="rbac-role-apply-to-all-units" */}
      {/*     labelText={t('in-settings:dialogs.role.roleDefinitionPerUnitCheckboxLabel')} */}
      {/*     onChange={(_e, { checked }) => */}
      {/*       updateIn(['applyToAllUnits'], applyToAllUnitsField.setValue(checked).setTouched(true)) */}
      {/*     } */}
      {/*   /> */}
      {/* </CarbonCheckboxGroup> */}
    </>
  );
}

function WebsitesSection() {
  const { form, updateIn } = useMapFormContext<RoleFormFields>(ROLE_FORM_ID);

  const permissionsField = form.getIn(['permissions']);

  return (
    <>
      <CarbonToggle
        toggled={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_WEBSITES_SCOPE])}
        id="rbac-role-website-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_WEBSITES_SCOPE
        })}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_WEBSITES_SCOPE],
            toRemoveOnDisabled: [
              Capability.CAN_CONFIGURE_EUM_APPLICATIONS,
              Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS
            ],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_WEBSITES_SCOPE]
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
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_EUM_APPLICATIONS])}
          id="rbac-role-websites-write-access"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_EUM_APPLICATIONS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_EUM_APPLICATIONS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_EUM_APPLICATIONS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_WEBSITES_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS])}
          id="rbac-role-websites-config-smart-alerts"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_WEBSITE_SMART_ALERTS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_WEBSITES_SCOPE]
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
        toggled={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE])}
        id="rbac-role-mobile-apps-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE
        })}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE],
            toRemoveOnDisabled: [
              Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING,
              Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS
            ],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE]
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
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING])}
          id="rbac-role-mobile-apps-write-access"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS])}
          id="rbac-role-mobile-apps-config-smart-alerts"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_MOBILE_APP_SMART_ALERTS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE]
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
        toggled={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_BIZOPS_SCOPE])}
        id="rbac-role-business-monitoring-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_BIZOPS_SCOPE
        })}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_BIZOPS_SCOPE],
            toRemoveOnDisabled: [AreaPermission.ACCESS_BIZOPS],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_BIZOPS_SCOPE]
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
          checked={containsAnyPermission(permissionsField.value, [AreaPermission.ACCESS_BIZOPS])}
          id="rbac-role-business-manage-and-configure"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: AreaPermission.ACCESS_BIZOPS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [AreaPermission.ACCESS_BIZOPS],
              toRemoveOnDisabled: [AreaPermission.ACCESS_BIZOPS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_BIZOPS_SCOPE]
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
        toggled={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE])}
        id="rbac-role-applications-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE
        })}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE],
            toRemoveOnDisabled: [
              Capability.CAN_VIEW_TRACE_DETAILS,
              Capability.CAN_CONFIGURE_SERVICE_MAPPING,
              Capability.CAN_CONFIGURE_APPLICATIONS,
              Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS,
              Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS
            ],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE]
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
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_VIEW_TRACE_DETAILS])}
          id="rbac-role-applications-view-trace-details"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_VIEW_TRACE_DETAILS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_VIEW_TRACE_DETAILS],
              toRemoveOnDisabled: [Capability.CAN_VIEW_TRACE_DETAILS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_SERVICE_MAPPING])}
          id="rbac-role-applications-config-service-mapping"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_SERVICE_MAPPING
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_SERVICE_MAPPING],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_SERVICE_MAPPING],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_APPLICATIONS])}
          id="rbac-role-applications-write-access"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_APPLICATIONS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_APPLICATIONS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_APPLICATIONS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS])}
          id="rbac-role-applications-config-smart-alerts"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_APPLICATION_SMART_ALERTS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckboxGroup legendText="">
          <CarbonCheckbox
            checked={containsAnyPermission(permissionsField.value, [
              Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS
            ])}
            id="rbac-role-applications-config-global-smart-alerts"
            labelText={t('in-settings:dialogs.role.permissionLabel', {
              context: Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS
            })}
            onChange={(_e, { checked: enabled }) => {
              const updatedPermissions = togglePermissions({
                current: permissionsField.value,
                enabled,
                toAddOnEnabled: [Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS],
                toRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_APPLICATION_SMART_ALERTS],
                toRemoveOnEnabled: [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE]
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
        checked={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_PCF_SCOPE])}
        id="rbac-role-platforms-cloud-foundry"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_PCF_SCOPE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_PCF_SCOPE],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_PCF_SCOPE]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_PHMC_SCOPE])}
        id="rbac-role-platforms-power-hmc"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_PHMC_SCOPE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_PHMC_SCOPE],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_PHMC_SCOPE]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_POWERVC_SCOPE])}
        id="rbac-role-platforms-powervc"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_POWERVC_SCOPE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_POWERVC_SCOPE],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_POWERVC_SCOPE]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_OPENSTACK_SCOPE])}
        id="rbac-role-platforms-openstack"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_OPENSTACK_SCOPE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_OPENSTACK_SCOPE],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_OPENSTACK_SCOPE]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_KUBERNETES_SCOPE])}
        id="rbac-role-platforms-kubernetes"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_KUBERNETES_SCOPE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_KUBERNETES_SCOPE],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_KUBERNETES_SCOPE]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_NUTANIX_SCOPE])}
        id="rbac-role-platforms-nutanix"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_NUTANIX_SCOPE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_NUTANIX_SCOPE],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_NUTANIX_SCOPE]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_SAP_SCOPE])}
        id="rbac-role-platforms-sap"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_SAP_SCOPE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_SAP_SCOPE],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_SAP_SCOPE]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_VSPHERE_SCOPE])}
        id="rbac-role-platforms-vsphere"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_VSPHERE_SCOPE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_VSPHERE_SCOPE],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_VSPHERE_SCOPE]
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
        toggled={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE])}
        id="rbac-role-infrastructure-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE
        })}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE],
            toRemoveOnDisabled: [
              AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE,
              Capability.CAN_CREATE_HEAP_DUMP,
              Capability.CAN_CREATE_THREAD_DUMP,
              Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS
            ],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE]
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
          checked={containsAnyPermission(permissionsField.value, [AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE])}
          id="rbac-role-infrastructure-view-analyze"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE
          })}
          helperText={t('in-settings:dialogs.role.infrastructureViewAnalyzeCheckboxLegendText')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE],
              toRemoveOnDisabled: [AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CREATE_HEAP_DUMP])}
          id="rbac-role-infrastructure-create-heap-dump"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CREATE_HEAP_DUMP
          })}
          helperText={t('in-settings:dialogs.role.infrastructureCreateHeapDumpCheckboxLegendText')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CREATE_HEAP_DUMP],
              toRemoveOnDisabled: [Capability.CAN_CREATE_HEAP_DUMP],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CREATE_THREAD_DUMP])}
          id="rbac-role-infrastructure-create-thread-dump"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CREATE_THREAD_DUMP
          })}
          helperText={t('in-settings:dialogs.role.infrastructureCreateThreadDumpCheckbboxLegendText')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CREATE_THREAD_DUMP],
              toRemoveOnDisabled: [Capability.CAN_CREATE_THREAD_DUMP],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS])}
          id="rbac-role-infrastructure-config-global-smart-alerts"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS
          })}
          helperText={t('in-settings:dialogs.role.infrastructureConfigGlobalSmartAlertsCheckboxLegendText')}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE]
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
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS])}
        id="rbac-role-custom-dashboards-share-public"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS
        })}
        helperText={t('in-settings:dialogs.role.customDashboardsSharePublickCheckboxLegendText')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS],
            toRemoveOnDisabled: [Capability.CAN_CREATE_PUBLIC_CUSTOM_DASHBOARDS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS])}
        id="rbac-role-custom-dashboards-manage-all"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS
        })}
        helperText={t('in-settings:dialogs.role.customDashboardsManageAllCheckboxLegendText')}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS],
            toRemoveOnDisabled: [Capability.CAN_EDIT_ALL_ACCESSIBLE_CUSTOM_DASHBOARDS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS])}
        id="rbac-role-custom-dashboard-config-service-level-indicators"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS]
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
        toggled={containsAnyPermission(permissionsField.value, [Capability.CAN_VIEW_LOGS])}
        id="rbac-role-logs-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_VIEW_LOGS
        })}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_VIEW_LOGS],
            toRemoveOnDisabled: [
              Capability.CAN_VIEW_LOGS,
              Capability.CAN_CONFIGURE_LOG_MANAGEMENT,
              Capability.CAN_DELETE_LOGS,
              Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS,
              Capability.CAN_VIEW_LOG_VOLUME,
              Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD
            ]
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
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_LOG_MANAGEMENT])}
          id="rbac-role-logs-management"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_LOG_MANAGEMENT
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_CONFIGURE_LOG_MANAGEMENT],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_LOG_MANAGEMENT]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_DELETE_LOGS])}
          id="rbac-role-logs-delete"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_DELETE_LOGS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_DELETE_LOGS],
              toRemoveOnDisabled: [Capability.CAN_DELETE_LOGS]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS])}
          id="rbac-role-logs-config-global-smart-alerts"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_VIEW_LOG_VOLUME])}
          id="rbac-role-logs-view-volume-report"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_VIEW_LOG_VOLUME
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_VIEW_LOG_VOLUME],
              toRemoveOnDisabled: [Capability.CAN_VIEW_LOG_VOLUME]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD])}
          id="rbac-role-logs-config-retention-period"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_VIEW_LOGS, Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_LOG_RETENTION_PERIOD]
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
    Capability.CAN_VIEW_SYNTHETIC_LOCATIONS,
    Capability.CAN_VIEW_SYNTHETIC_TESTS,
    Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS
  ];

  return (
    <>
      <CarbonToggle
        toggled={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE])}
        id="rbac-role-synhetics-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE
        })}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: syntheticsViewPermissions,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE],
            toRemoveOnDisabled: [
              ...syntheticsViewPermissions,
              Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS,
              Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS,
              Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS,
              Capability.CAN_CONFIGURE_SYNTHETIC_TESTS,
              Capability.CAN_USE_SYNTHETIC_CREDENTIALS
            ],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]
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
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_SYNTHETIC_TESTS])}
          id="rbac-role-synthetics-write-access"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_SYNTHETIC_TESTS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [...syntheticsViewPermissions, Capability.CAN_CONFIGURE_SYNTHETIC_TESTS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_SYNTHETIC_TESTS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [
            Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS
          ])}
          id="rbac-role-synthetics-config-smart-alerts"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [...syntheticsViewPermissions, Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS])}
          id="rbac-role-synthetics-config-locations"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [...syntheticsViewPermissions, Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_USE_SYNTHETIC_CREDENTIALS])}
          id="rbac-role-synthetics-use-credentials"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_USE_SYNTHETIC_CREDENTIALS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [...syntheticsViewPermissions, Capability.CAN_USE_SYNTHETIC_CREDENTIALS],
              toRemoveOnDisabled: [Capability.CAN_USE_SYNTHETIC_CREDENTIALS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS])}
          id="rbac-role-synthetics-config-credentials"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [...syntheticsViewPermissions, Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]
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
        toggled={!containsAnyPermission(permissionsField.value, [LimitedAccessScope.LIMITED_AUTOMATION_SCOPE])}
        id="rbac-role-automation-access"
        hideLabel
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: LimitedAccessScope.LIMITED_AUTOMATION_SCOPE
        })}
        onToggle={enabled => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnDisabled: [LimitedAccessScope.LIMITED_AUTOMATION_SCOPE],
            toRemoveOnDisabled: [
              Capability.CAN_RUN_AUTOMATION_ACTIONS,
              Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS,
              Capability.CAN_CONFIGURE_AUTOMATION_POLICIES,
              Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY
            ],
            toRemoveOnEnabled: [LimitedAccessScope.LIMITED_AUTOMATION_SCOPE]
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
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_RUN_AUTOMATION_ACTIONS])}
          id="rbac-role-automation-run-actions"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_RUN_AUTOMATION_ACTIONS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_RUN_AUTOMATION_ACTIONS],
              toRemoveOnDisabled: [Capability.CAN_RUN_AUTOMATION_ACTIONS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_AUTOMATION_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS])}
          id="rbac-role-automation-config-actions"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_AUTOMATION_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_AUTOMATION_POLICIES])}
          id="rbac-role-automation-config-policies"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_AUTOMATION_POLICIES
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_AUTOMATION_POLICIES],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_AUTOMATION_POLICIES],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_AUTOMATION_SCOPE]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY])}
          id="rbac-role-automation-delete-action-history"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY],
              toRemoveOnDisabled: [Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY],
              toRemoveOnEnabled: [LimitedAccessScope.LIMITED_AUTOMATION_SCOPE]
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
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_INTEGRATIONS])}
        id="rbac-role-events-and-alerts-config-alert-channels"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_INTEGRATIONS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_INTEGRATIONS],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_INTEGRATIONS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS])}
        id="rbac-role-events-and-alerts-config-events-alerts"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_EVENTS_AND_ALERTS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS])}
        id="rbac-role-events-and-alerts-config-maintenance-windows"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_MAINTENANCE_WINDOWS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD])}
        id="rbac-role-events-and-alerts-config-global-alert-payload"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_GLOBAL_ALERT_PAYLOAD]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_MANUALLY_CLOSE_ISSUE])}
        id="rbac-role-events-and-alerts-manually-close"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_MANUALLY_CLOSE_ISSUE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_MANUALLY_CLOSE_ISSUE],
            toRemoveOnDisabled: [Capability.CAN_MANUALLY_CLOSE_ISSUE]
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
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS])}
        id="rbac-role-global-functions-config-personal-api-tokens"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_PERSONAL_API_TOKENS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_RELEASES])}
        id="rbac-role-global-functions-config-releases"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_RELEASES
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_RELEASES],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_RELEASES]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION])}
        id="rbac-role-global-functions-view-billing-info"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION],
            toRemoveOnDisabled: [Capability.CAN_VIEW_ACCOUNT_AND_BILLING_INFORMATION]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT])}
        id="rbac-role-global-functions-config-database-management"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_DATABASE_MANAGEMENT]
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
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_INSTALL_NEW_AGENTS])}
        id="rbac-role-agent-deployment-install-agents"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_INSTALL_NEW_AGENTS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_INSTALL_NEW_AGENTS],
            toRemoveOnDisabled: [Capability.CAN_INSTALL_NEW_AGENTS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_AGENTS])}
        id="rbac-role-agent-deployment-config-agents"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_AGENTS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_AGENTS],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_AGENTS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_AGENT_RUN_MODE])}
        id="rbac-role-agent-deployment-config-agent-mode"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_AGENT_RUN_MODE
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_AGENT_RUN_MODE],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_AGENT_RUN_MODE]
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
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_TEAMS])}
        id="rbac-role-access-control-config-teams"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_TEAMS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_TEAMS],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_TEAMS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      {/* Note: Role specific permissions are not yet available in backend */}
      {/* <CarbonCheckboxGroup legendText="" helperText={t('in-settings:dialogs.role.accessControlRoleManagementHelpText')}> */}
      {/*   <CarbonCheckbox */}
      {/*     checked={containsAnyPermission(permissionsField.value, [])} */}
      {/*     id="rbac-role-access-control-role-management" */}
      {/*   labelText={t('in-settings:dialogs.role.permissionLabel', { */}
      {/*     context: Capability.CAN_CONFIGURE_ROLES */}
      {/*   })} */}
      {/*     onChange={(_e, { checked: enabled }) => { */}
      {/*       const updatedPermissions = togglePermissions({ */}
      {/*         current: permissionsField.value, */}
      {/*         toAddOnEnabled: [], */}
      {/*         toRemoveOnDisabled: [], */}
      {/*         enabled */}
      {/*       }); */}
      {/*       updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true)); */}
      {/*     }} */}
      {/*   /> */}
      {/* </CarbonCheckboxGroup> */}
      {/* <CarbonCheckboxGroup */}
      {/*   legendText="" */}
      {/*   helperText={t('in-settings:dialogs.role.accessControlTeamScopeManagementHelpText')} */}
      {/* > */}
      {/*   <CarbonCheckbox */}
      {/*     checked={containsAnyPermission(permissionsField.value, [])} */}
      {/*     id="rbac-role-access-control-team-scope-management" */}
      {/*     labelText={t('in-settings:dialogs.role.accessControlTeamScopeManagementCheckboxLabel')} */}
      {/*     onChange={(_e, { checked: enabled }) => { */}
      {/*       const updatedPermissions = togglePermissions({ */}
      {/*         current: permissionsField.value, */}
      {/*         toAddOnEnabled: [], */}
      {/*         toRemoveOnDisabled: [], */}
      {/*         enabled */}
      {/*       }); */}
      {/*       updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true)); */}
      {/*     }} */}
      {/*   /> */}
      {/* </CarbonCheckboxGroup> */}
      <CarbonCheckboxGroup
        legendText=""
        helperText={t('in-settings:dialogs.role.accessControlConfigApiTokensHelpText')}
      >
        <CarbonCheckbox
          checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_API_TOKENS])}
          id="rbac-role-access-control-config-api-tokens"
          labelText={t('in-settings:dialogs.role.permissionLabel', {
            context: Capability.CAN_CONFIGURE_API_TOKENS
          })}
          onChange={(_e, { checked: enabled }) => {
            const updatedPermissions = togglePermissions({
              current: permissionsField.value,
              enabled,
              toAddOnEnabled: [Capability.CAN_CONFIGURE_API_TOKENS],
              toRemoveOnDisabled: [Capability.CAN_CONFIGURE_API_TOKENS]
            });
            updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
          }}
        />
      </CarbonCheckboxGroup>
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS])}
        id="rbac-role-access-control-config-auth-methods"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_AUTHENTICATION_METHODS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_VIEW_AUDIT_LOG])}
        id="rbac-role-access-control-view-audit-trail"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_VIEW_AUDIT_LOG
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_VIEW_AUDIT_LOG],
            toRemoveOnDisabled: [Capability.CAN_VIEW_AUDIT_LOG]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
      <CarbonCheckbox
        checked={containsAnyPermission(permissionsField.value, [Capability.CAN_CONFIGURE_SESSION_SETTINGS])}
        id="rbac-role-access-control-view-token-and-timeout-settings"
        labelText={t('in-settings:dialogs.role.permissionLabel', {
          context: Capability.CAN_CONFIGURE_SESSION_SETTINGS
        })}
        onChange={(_e, { checked: enabled }) => {
          const updatedPermissions = togglePermissions({
            current: permissionsField.value,
            enabled,
            toAddOnEnabled: [Capability.CAN_CONFIGURE_SESSION_SETTINGS],
            toRemoveOnDisabled: [Capability.CAN_CONFIGURE_SESSION_SETTINGS]
          });
          updateIn(['permissions'], permissionsField.setValue(updatedPermissions).setTouched(true));
        }}
      />
    </CarbonCheckboxGroup>
  );
}
