/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS, List } from 'immutable';
import React from 'react';

import {
  createMaintenanceConfig,
  createMaintenanceWindow,
  getMaintenanceConfig,
  saveMaintenanceConfig
} from 'in-api/maintenanceConfiguration';
import MaintenanceConfigurationForm from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm';
import { queryValidationResultValidator, queryValidationInProgressValidator, valid } from 'in-settings/validation';
import { applicationIdsToDfq, parseQuery } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { teamSettingsAlertingMaintenanceConfigurations } from 'in-settings/navigation/paths';
import { formatTime, formatDate, parseDateTime } from 'in-services/formatters/date';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { timeValidator, dateValidator } from 'in-services/validators/date';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import entityForm from 'in-hoc/entityForm';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './MaintenanceConfiguration.mless';

export default function MaintenanceConfiguration(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title={t('in-settings:tabs.maintenanceWindow')}
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
  const { entity, form, message, error, loading, isCreate } = props;

  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownMaintenanceWindowConfiguration')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {entity.get('errors').get(0)}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  return (
    <SettingsDetailPage>
      <SubViewHeader>
        <SvgIcon type="lib_actions_build_outline" size="l" className={locals.headerIcon} />
        {isCreate ? t('in-settings:tabs.scheduleMaintenanceWindow') : t('in-settings:tabs.changeMaintenanceWindow')}
      </SubViewHeader>
      <SectionLine />

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
    </SettingsDetailPage>
  );
});

function save(config, form) {
  const window = form.get('window');
  const windowStart = getTime(window.get('start'));
  const windowEnd = getTime(window.get('end'));

  // the query field might not exist in case 'Apply on ALL' is selected,
  // which corresponds to an empty query
  const query = getQueryFromFormField(form);

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
    updatedForm = updatedForm.remove('applicationIds');
  } else if (applyOn === 'application') {
    updatedForm = updatedForm.remove('query');
    updatedForm = putApplicationIdFields(updatedForm, []);
  } else {
    updatedForm = putQueryFields(updatedForm, '');
  }
  return updatedForm;
}

function createForm(config, isCreate) {
  const windows = config.get('windows', List([]));
  const firstWindow = windows.size > 0 ? windows.get(0).toJS() : createMaintenanceWindow();

  const query = config.get('query');

  // always set to 'Dynamic Focus Query' per default for new configs, so that
  // the user manually has to select 'All' in case he really want that
  //const applyOn = isCreate || isNotBlank(query) ? 'dfq' : 'all';

  const { applyOn, applicationIds } = isCreate ? { applyOn: 'dfq', applicationIds: [] } : parseQuery(query);

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

  if (applyOn === 'application') {
    form = putApplicationIdFields(form, applicationIds);
  }

  return form;
}

function selectedApplicationsValidator(selectedApplications) {
  if (selectedApplications.size === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtLeastOneApplication')
      }
    ];
  }
}

function putApplicationIdFields(form, applicationIds) {
  let updatedForm = form.put(
    'applicationIds',
    createField({
      value: applicationIds ? applicationIds : [],
      validator: selectedApplicationsValidator
    })
  );
  return updatedForm;
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

function getQueryFromFormField(form) {
  if (form.containsKey('applicationIds')) {
    return applicationIdsToDfq(form.get('applicationIds').value);
  } else if (form.containsKey('query')) {
    return form.get('query').value;
  } else {
    return '';
  }
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
        message: t('in-settings:tabs.startTimeMustBeSmallerThanEndTime')
      }
    ];
  }

  if ((!windowStart && windowEnd) || (windowStart && !windowEnd)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.eitherBothOrNoneOfStartTimeAndEndTimeHaveToBeSpecified')
      }
    ];
  }

  return null;
}
