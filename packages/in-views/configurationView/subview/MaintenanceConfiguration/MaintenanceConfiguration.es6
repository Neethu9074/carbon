import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS } from 'immutable';
import React from 'react';

import { createMaintenanceConfig, getMaintenanceConfig, saveMaintenanceConfig } from 'in-api/maintenanceConfiguration';
import MaintenanceConfigurationForm from 'in-views/configurationView/subview/MaintenanceConfiguration/MaintenanceConfigurationForm';
import { maintenanceConfigurationsPath } from 'in-stores/navigation/paths/settingPaths';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import Notification from 'in-components/form/Notification';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';
import Button from 'in-components/Button';

export default function MaintenanceConfiguration(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Maintenance Window"
      entityId={entityId}
      createDefaultEntity={createMaintenanceConfig}
      createForm={createForm}
      getEntityFromApi={getMaintenanceConfig}
      openEntities={() => goToPath(maintenanceConfigurationsPath)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function MaintenanceForm(props) {
  const { form, message, error, loading } = props;

  return (
    <div>
      <SubViewHeader>Maintenance Window</SubViewHeader>

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

      <MaintenanceConfigurationForm {...props} />
    </div>
  );
});

function save(config, form) {
  return saveMaintenanceConfig(
    fromJS(
      createMaintenanceConfig(
        config ? config.get('id') : null,
        form.get('name').value,
        form.get('query').value
        // TODO windows-id / start / end
      )
    )
  );
}

function createForm(config) {
  return createMapForm()
    .put(
      'name',
      createField({
        value: config.get('name'),
        validator: notBlankValidator
      })
    )
    .put(
      'query',
      createField({
        value: config.get('query')
      })
    );
}
