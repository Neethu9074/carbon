import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { Map } from 'immutable';
import React from 'react';

import RoleForm from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/RoleForm';
import { teamSettingsAccessControlRoles } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SaveCancel from 'in-settings/components/SaveCancel';
import { getRole, saveRole, createRole } from 'in-api/roles';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function AlertingConfiguration(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Role Configuration"
      entityId={entityId}
      createDefaultEntity={createRole}
      createForm={createForm}
      getEntityFromApi={getRole}
      openEntities={() => goToPath(teamSettingsAccessControlRoles)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { entity, form, message, error, loading, isCreate } = props;

  const roleId = form ? form.get('id').value : null;

  return (
    <SettingsDetailPage>
      <SubViewHeader>{isCreate ? 'Create Role' : `Configure Role: ${entity.get('name')}`}</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <RoleForm {...props} roleId={roleId} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAccessControlRoles}
      />
    </SettingsDetailPage>
  );
});

function save(entity, form) {
  const role = Map(form.toJS());
  return saveRole(role);
}

function createForm(role) {
  return createMapForm()
    .put('id', createField({ value: role.get('id') }))
    .put(
      'name',
      createField({
        value: role.get('name'),
        validator: notBlankValidator
      })
    )
    .put('restrictedAccess', createField({ value: role.get('restrictedAccess') }))
    .put('canConfigureServiceMapping', createField({ value: role.get('canConfigureServiceMapping') }))
    .put('canConfigureEumApplications', createField({ value: role.get('canConfigureEumApplications') }))
    .put('canConfigureUsers', createField({ value: role.get('canConfigureUsers') }))
    .put('canInstallNewAgents', createField({ value: role.get('canInstallNewAgents') }))
    .put('canSeeUsageInformation', createField({ value: role.get('canSeeUsageInformation') }))
    .put('canConfigureIntegrations', createField({ value: role.get('canConfigureIntegrations') }))
    .put('canSeeOnPremLicenseInformation', createField({ value: role.get('canSeeOnPremLicenseInformation') }))
    .put('canConfigureRoles', createField({ value: role.get('canConfigureRoles') }))
    .put('canConfigureTeams', createField({ value: role.get('canConfigureTeams') }))
    .put('canConfigureCustomAlerts', createField({ value: role.get('canConfigureCustomAlerts') }))
    .put('canConfigureApiTokens', createField({ value: role.get('canConfigureApiTokens') }))
    .put('canConfigureAgentRunMode', createField({ value: role.get('canConfigureAgentRunMode') }))
    .put('canViewAuditLog', createField({ value: role.get('canViewAuditLog') }))
    .put('canConfigureAgents', createField({ value: role.get('canConfigureAgents') }))
    .put('canConfigureAuthenticationMethods', createField({ value: role.get('canConfigureAuthenticationMethods') }))
    .put('canConfigureApplications', createField({ value: role.get('canConfigureApplications') }));
}
