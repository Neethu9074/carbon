import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS } from 'immutable';
import React from 'react';

import {
  createMaintenanceConfig,
  createMaintenanceWindow,
  getMaintenanceConfig,
  saveMaintenanceConfig
} from 'in-api/maintenanceConfiguration';
import MaintenanceConfigurationForm from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/MaintenanceConfigurations/MaintenanceConfigurationForm';
import {
  queryValidationResultValidator,
  queryValidationInProgressValidator,
  valid
} from 'in-views/configurationView/validation';
import { teamSettingsAlertingMaintenanceConfigurations } from 'in-views/configurationView/navigation/paths';
import { formatTime, formatDate, parseDateTime } from 'in-services/formatters/date';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { timeValidator, dateValidator } from 'in-services/validators/date';
import SaveCancel from 'in-views/configurationView/components/SaveCancel';
import Section from 'in-views/configurationView/components/Section';
import Notification from 'in-components/form/Notification';
import { isNotBlank } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import entityForm from 'in-hoc/entityForm';

import locals from './MaintenanceConfiguration.mless';

export default function MaintenanceConfiguration(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Maintenance Window"
      entityId={entityId}
      createDefaultEntity={createMaintenanceConfig}
      createForm={config => createForm(config, !entityId)}
      getEntityFromApi={getMaintenanceConfig}
      openEntities={() => goToPath(teamSettingsAlertingMaintenanceConfigurations)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function MaintenanceForm(props) {
  const { form, message, error, loading, isCreate } = props;

  return (
    <div>
      <SubViewHeader>
        <SvgIcon type="lib_actions_build_outline" width={32} height={32} className={locals.headerIcon} />
        {isCreate ? 'Schedule' : 'Change'} Maintenance Window
      </SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <MaintenanceConfigurationForm onChangeApplyOn={onChangeApplyOn} {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAlertingMaintenanceConfigurations}
      />
    </div>
  );
});

function save(config, form) {
  const window = form.get('window');
  const windowStart = getTime(window.get('start'));
  const windowEnd = getTime(window.get('end'));

  // the query field might not exist in case 'Apply on ALL' is selected,
  // which corresponds to an empty query
  const query = form.containsKey('query') ? form.get('query').value : '';

  return saveMaintenanceConfig(
    fromJS(
      createMaintenanceConfig(
        config ? config.get('id') : null,
        form.get('name').value,
        query,
        windowStart && windowEnd ? [createMaintenanceWindow(window.get('id').value, windowStart, windowEnd)] : []
      )
    )
  );
}

function getTime(subForm) {
  return parseDateTime(`${subForm.get('date').value} ${subForm.get('time').value}`).getTime();
}

function onChangeApplyOn(form, applyOn) {
  if (!applyOn) {
    return;
  }
  let updatedForm = form.updateIn(['applyOn'], field => field.setValue(applyOn).setTouched(true));
  if (applyOn === 'all') {
    updatedForm = updatedForm.remove('query');
  } else {
    updatedForm = putQueryFields(updatedForm, '');
  }
  return updatedForm;
}

function createForm(config, isCreate) {
  const windows = config.get('windows');
  const firstWindow = windows.size > 0 ? windows.get(0).toJS() : createMaintenanceWindow();

  const query = config.get('query');
  // always set to 'Dynamic Focus Query' per default for new configs, so that
  // the user manually has to select 'All' in case he really want that
  const applyOn = isCreate || isNotBlank(query) ? 'dfq' : 'all';

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: config.get('name'),
        validator: notBlankValidator
      })
    )
    .put('window', getWindowSubForm(firstWindow))
    .put(
      'applyOn',
      createField({
        value: applyOn,
        validator: notBlankValidator
      })
    );

  if (applyOn === 'dfq') {
    form = putQueryFields(form, query);
  }

  return form;
}

function putQueryFields(form, query) {
  let updatedForm = form.put(
    'query',
    createField({
      value: query,
      validator: notBlankValidator
    })
  );
  updatedForm = updatedForm.put(
    'validationResult',
    createField({
      value: valid(),
      validator: queryValidationResultValidator
    })
  );
  updatedForm = updatedForm.put(
    'queryValidationInProgress',
    createField({
      value: false,
      validator: queryValidationInProgressValidator
    })
  );
  return updatedForm;
}

function getWindowSubForm(window) {
  return createMapForm({
    // using items instead of put, so that windowValidator is only called once
    // after all fields/subForms are added
    items: {
      id: createField({
        value: window.id
      }),
      start: getDateTimeSubForm(window.start),
      end: getDateTimeSubForm(window.end)
    },
    validator: windowValidator
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

function windowValidator(w) {
  if (!w) {
    return null;
  }

  const windowStart = getTime(w.start);
  const windowEnd = getTime(w.end);

  if (windowStart && windowEnd && windowStart >= windowEnd) {
    return [
      {
        severity: 'error',
        message: `Start time must be smaller than end time.`
      }
    ];
  }

  if ((!windowStart && windowEnd) || (windowStart && !windowEnd)) {
    return [
      {
        severity: 'error',
        message: `Either both or none of start time and end time have to be specified.`
      }
    ];
  }

  return null;
}
