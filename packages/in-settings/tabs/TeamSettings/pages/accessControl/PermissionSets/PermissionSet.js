import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { Map, List } from 'immutable';
import React from 'react';

import PermissionSetForm from 'in-settings/tabs/TeamSettings/pages/accessControl/PermissionSets/PermissionSetForm';
import { getPermissionSet, savePermissionSet, createPermissionSet } from 'in-api/permissionSets';
import { teamSettingsAccessControlPermissionSets } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function PermissionSet(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Access Scope Configuration"
      entityId={entityId}
      createDefaultEntity={createPermissionSet}
      createForm={createForm}
      getEntityFromApi={getPermissionSet}
      openEntities={() => goToPath(teamSettingsAccessControlPermissionSets)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { entity, form, message, error, loading, isCreate } = props;
  return (
    <SettingsDetailPage>
      <SubViewHeader>
        {isCreate ? 'Create Access Scope' : `Configure Access Scope: ${entity.get('name')}`}
      </SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <PermissionSetForm {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAccessControlPermissionSets}
      />
    </SettingsDetailPage>
  );
});

function save(entity, form) {
  const permissionSet = Map(form.toJS());
  return savePermissionSet(permissionSet);
}

function createForm(permissionSet) {
  return createMapForm()
    .put('id', createField({ value: permissionSet.get('id') }))
    .put(
      'name',
      createField({
        value: permissionSet.get('name'),
        validator: notBlankValidator
      })
    )
    .put(
      'permissions',
      createField({
        value: permissionSet.get('permissions', List())
      })
    )
    .put(
      'applicationIds',
      createField({
        value: permissionSet.get('applicationIds', List())
      })
    )
    .put(
      'kubernetesClusterUUIDs',
      createField({
        value: permissionSet.get('kubernetesClusterUUIDs', List())
      })
    )
    .put(
      'kubernetesNamespaceUIDs',
      createField({
        value: permissionSet.get('kubernetesNamespaceUIDs', List())
      })
    )
    .put(
      'websiteIds',
      createField({
        value: permissionSet.get('websiteIds', List())
      })
    );
}
