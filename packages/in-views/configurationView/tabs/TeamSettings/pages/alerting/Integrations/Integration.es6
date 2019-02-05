import { fromJS } from 'immutable';
import React from 'react';

import IntegrationTestButton from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/components/IntegrationTestButton';
import { fullyQualified } from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/configs';
import { teamSettingsAlertingIntegrations } from 'in-views/configurationView/navigation/paths';
import SettingsDetailPage from 'in-views/configurationView/components/SettingsDetailPage';
import { getIntegration, saveIntegration, createIntegration } from 'in-api/integrations';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import SaveCancel from 'in-views/configurationView/components/SaveCancel';
import Section from 'in-views/configurationView/components/Section';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Notification from 'in-components/form/Notification';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function Integration(props) {
  const kind = getMatrixParameter(props.location, '/integrations', 'kind');
  const entityId = props.match.params.id;

  return (
    <IntegrationForm
      title="Integration"
      entityId={entityId}
      createDefaultEntity={() => createIntegration(null, kind)}
      createForm={createForm}
      getEntityFromApi={getIntegration}
      openEntities={() => goToPath(teamSettingsAlertingIntegrations)}
      saveEntity={save}
    />
  );
}

function save(integration, form) {
  return saveIntegration(fromJS(fullyQualified[integration.get('kind')].createEntity(integration, form)));
}

function createForm(config) {
  return fullyQualified[config.get('kind')].createForm(config);
}

const IntegrationForm = entityForm(function IntegrationForm(props) {
  const { entity, form, message, error, loading, setForm, isCreate } = props;
  const Form = fullyQualified[props.form.get('kind').value].Form;
  return (
    <SettingsDetailPage>
      <SubViewHeader>{`${isCreate ? 'Create' : 'Configure'}
      ${fullyQualified[entity.get('kind')].label}
      Integration`}</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <Form {...props} />

      <IntegrationTestButton integration={entity} form={form} setForm={setForm} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAlertingIntegrations}
      />
    </SettingsDetailPage>
  );
});
