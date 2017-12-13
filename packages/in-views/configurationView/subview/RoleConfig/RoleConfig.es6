import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { Map } from 'immutable';
import React from 'react';

import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import RoleForm from 'in-views/configurationView/subview/RoleConfig/RoleForm';
import { rolesConfigPath } from 'in-stores/navigation/paths/settingPaths';
import { getRole, saveRole, createRole } from 'in-services/api/roles';
import Section from 'in-views/configurationView/components/Section';
import { queryValidator } from 'in-stores/search/validations';
import { ownerRoleId, fallbackRoleId } from 'in-stores/user';
import Notification from 'in-components/form/Notification';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';
import Button from 'in-components/Button';

export default function AlertingConfiguration(props) {
  const entityId = props.match.params.roleId;

  return (
    <Form
      title="Role Configuration"
      entityId={entityId}
      createDefaultEntity={createRole}
      createForm={createForm}
      getEntityFromApi={getRole}
      openEntities={() => goToPath(rolesConfigPath)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function IntegrationForm(props) {
  const { entity, form, message, error, loading } = props;

  const roleId = form ? form.get('id').value : null;
  // do not allow editing of the owner or fallback role
  const disabled = roleId == null || roleId === ownerRoleId || roleId === fallbackRoleId;

  return (
    <div>
      <SubViewHeader>Configure Role: {entity.get('name')}</SubViewHeader>

      <Section>
        <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
          Save
        </Button>

        {message ? (
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        ) : null}
      </Section>

      <RoleForm {...props} disabled={disabled} />
    </div>
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
    .put(
      'implicitViewFilter',
      createField({
        value: role.get('implicitViewFilter'),
        validator: queryValidator
      })
    )
    .put('canConfigureServiceMapping', createField({ value: role.get('canConfigureServiceMapping') }))
    .put('canConfigureEumApplications', createField({ value: role.get('canConfigureEumApplications') }))
    .put('canConfigureUsers', createField({ value: role.get('canConfigureUsers') }))
    .put('canInstallNewAgents', createField({ value: role.get('canInstallNewAgents') }))
    .put('canSeeUsageInformation', createField({ value: role.get('canSeeUsageInformation') }))
    .put('canConfigureIntegrations', createField({ value: role.get('canConfigureIntegrations') }))
    .put('canSeeOnPremLicenseInformation', createField({ value: role.get('canSeeOnPremLicenseInformation') }))
    .put('canConfigureRoles', createField({ value: role.get('canConfigureRoles') }))
    .put('canConfigureCustomAlerts', createField({ value: role.get('canConfigureCustomAlerts') }))
    .put('canConfigureApiTokens', createField({ value: role.get('canConfigureApiTokens') }))
    .put('canConfigureAgentRunMode', createField({ value: role.get('canConfigureAgentRunMode') }))
    .put('canViewAuditLog', createField({ value: role.get('canViewAuditLog') }))
    .put('canConfigureAgents', createField({ value: role.get('canConfigureAgents') }));
}
