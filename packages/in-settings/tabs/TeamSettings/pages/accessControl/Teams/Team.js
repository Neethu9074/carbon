import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { Map, List } from 'immutable';
import React from 'react';

import TeamForm from 'in-settings/tabs/TeamSettings/pages/accessControl/Teams/TeamForm';
import { teamSettingsAccessControlTeams } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getTeam, saveTeam, createTeam } from 'in-api/teams';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function Team(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Team Configuration"
      entityId={entityId}
      createDefaultEntity={createTeam}
      createForm={createForm}
      getEntityFromApi={getTeam}
      openEntities={() => goToPath(teamSettingsAccessControlTeams)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { entity, form, message, error, loading, isCreate } = props;
  return (
    <SettingsDetailPage>
      <SubViewHeader>{isCreate ? 'Create Team' : `Configure Team: ${entity.get('name')}`}</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <TeamForm {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAccessControlTeams}
      />
    </SettingsDetailPage>
  );
});

function save(entity, form) {
  const team = Map(form.toJS());
  return saveTeam(team);
}

function createForm(team) {
  return createMapForm()
    .put('id', createField({ value: team.get('id') }))
    .put(
      'name',
      createField({
        value: team.get('name'),
        validator: notBlankValidator
      })
    )
    .put(
      'permissions',
      createField({
        value: team.get('permissions', List())
      })
    )
    .put(
      'members',
      createField({
        value: team.get('members', List())
      })
    );
}
