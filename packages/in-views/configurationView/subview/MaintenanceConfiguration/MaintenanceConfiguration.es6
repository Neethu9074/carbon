import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS } from 'immutable';
import React from 'react';

import {
  createMaintenanceConfig,
  createMaintenanceWindow,
  getMaintenanceConfig,
  saveMaintenanceConfig
} from 'in-api/maintenanceConfiguration';
import MaintenanceConfigurationForm from 'in-views/configurationView/subview/MaintenanceConfiguration/MaintenanceConfigurationForm';
import { maintenanceConfigurationsPath } from 'in-stores/navigation/paths/settingPaths';
import { formatTime, formatDate, parseDateTime } from 'in-services/formatters/date';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { timeValidator, dateValidator } from 'in-services/validators/date';
import Section from 'in-views/configurationView/components/Section';
import { queryValidator } from 'in-stores/search/validations';
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
  const window = form.get('window');
  const windowStart = getTime(window.get('start'));
  const windowEnd = getTime(window.get('end'));

  return saveMaintenanceConfig(
    fromJS(
      createMaintenanceConfig(
        config ? config.get('id') : null,
        form.get('name').value,
        form.get('query').value,
        windowStart && windowEnd ? [createMaintenanceWindow(window.get('id').value, windowStart, windowEnd)] : []
      )
    )
  );
}

function getTime(subForm) {
  return parseDateTime(`${subForm.get('date').value} ${subForm.get('time').value}`).getTime();
}

function createForm(config) {
  const windows = config.get('windows');
  const firstWindow = windows.size > 0 ? windows.get(0).toJS() : createMaintenanceWindow();

  let form = createMapForm({
    items: {
      window: getWindowSubForm(firstWindow)
    }
  })
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
        value: config.get('query'),
        validator: queryValidator
      })
    )
    .put(
      'validationResult',
      createField({
        value: {
          valid: true,
          error: null
        }
      })
    );

  return form;
}

function getWindowSubForm(window) {
  return createMapForm({
    items: {
      id: createField({
        value: window.id
      }),
      start: getDateTimeSubForm(window.start),
      end: getDateTimeSubForm(window.end)
    }
  });
}

function getDateTimeSubForm(ts) {
  return createMapForm()
    .put(
      'date',
      createField({
        value: formatDate(ts) || '',
        validator: dateValidator
      })
    )
    .put(
      'time',
      createField({
        value: formatTime(ts) || '',
        validator: timeValidator
      })
    );
}
