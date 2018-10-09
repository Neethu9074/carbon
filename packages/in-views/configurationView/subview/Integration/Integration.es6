import { fromJS } from 'immutable';
import React from 'react';

import { getIntegration, saveIntegration, createIntegration, testIntegration } from 'in-api/integrations';
import { fullyQualified } from 'in-views/configurationView/subview/Integration/configs';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { integrationsPath } from 'in-stores/navigation/paths/settingPaths';
import Section from 'in-views/configurationView/components/Section';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Notification from 'in-components/form/Notification';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';
import Button from 'in-components/Button';

export default function Integration(props) {
  const kind = getMatrixParameter(props.location, '/integration', 'kind');
  const entityId = props.match.params.id;

  return (
    <IntegrationForm
      title="Integration"
      entityId={entityId}
      createDefaultEntity={() => createIntegration(null, kind)}
      createForm={createForm}
      getEntityFromApi={getIntegration}
      openEntities={() => goToPath(integrationsPath)}
      saveEntity={save}
      testEntity={test}
    />
  );
}

function save(integration, form) {
  return saveIntegration(fromJS(fullyQualified[integration.get('kind')].createEntity(integration, form)));
}

function test(integration, form) {
  return testIntegration(fromJS(fullyQualified[integration.get('kind')].createEntity(integration, form))).subscribe(
    () => {}
  );
}

function createForm(config) {
  return fullyQualified[config.get('kind')].createForm(config);
}

const IntegrationForm = entityForm(function IntegrationForm(props) {
  const { entity, form, message, error, loading } = props;

  const Form = fullyQualified[props.form.get('kind').value].Form;
  return (
    <div>
      <SubViewHeader>Configure {fullyQualified[entity.get('kind')].label} Integration</SubViewHeader>

      <Section>
        <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
          Save
        </Button>
        <Button kind="success" onClick={() => test(entity, form)} disabled={!form.hierarchyValid && form.touched}>
          Test
        </Button>
        {message ? (
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        ) : null}
      </Section>

      <Form {...props} />
    </div>
  );
});
