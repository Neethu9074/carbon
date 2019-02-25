import { fromJS } from 'immutable';
import React from 'react';

import AlertChannelTestButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelTestButton';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { getIntegration, saveIntegration, createIntegration } from 'in-api/integrations';
import { teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function AlertChannelModification(props) {
  const kind = getMatrixParameter(props.location, '/channels', 'kind');
  const entityId = props.match.params.id;

  return (
    <AlertChannelModificationForm
      title="Alert Channel"
      entityId={entityId}
      createDefaultEntity={() => createIntegration(null, kind)}
      createForm={createForm}
      getEntityFromApi={getIntegration}
      openEntities={() => goToPath(teamSettingsAlertingAlertChannels)}
      saveEntity={save}
    />
  );
}

function save(alertChannel, form) {
  return saveIntegration(fromJS(fullyQualified[alertChannel.get('kind')].createEntity(alertChannel, form)));
}

function createForm(config) {
  return fullyQualified[config.get('kind')].createForm(config);
}

const AlertChannelModificationForm = entityForm(function AlertChannelModificationForm(props) {
  const { entity, form, message, error, loading, setForm, isCreate } = props;
  const Form = fullyQualified[props.form.get('kind').value].Form;

  return (
    <SettingsDetailPage>
      <SubViewHeader>{`${
        isCreate ? 'Create ' + entity.get('kind') : 'Modify ' + entity.get('name')
      } Alert Channel`}</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <Form {...props} />

      <AlertChannelTestButton alertChannel={entity} form={form} setForm={setForm} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAlertingAlertChannels}
      />
    </SettingsDetailPage>
  );
});
