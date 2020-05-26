import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { Map } from 'immutable';
import React from 'react';

import { addPermissionFields } from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/permissionsForm';
import RoleForm from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/RoleForm';
import { teamSettingsAccessControlRoles } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getRole, saveRole, createRole } from 'in-api/roles';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import { submitRoleTracker } from 'in-settings/tracker';
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
      <SectionLine />

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

  submitRoleTracker({ name: entity.get('name') });
  return saveRole(role);
}

function createForm(role) {
  return addPermissionFields(
    createMapForm()
      .put('id', createField({ value: role.get('id') }))
      .put(
        'name',
        createField({
          value: role.get('name'),
          validator: notBlankValidator
        })
      )
      .put('restrictedAccess', createField({ value: role.get('restrictedAccess') })),
    role
  );
}
