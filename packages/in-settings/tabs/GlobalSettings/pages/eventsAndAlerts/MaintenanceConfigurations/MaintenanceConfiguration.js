/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import { List } from 'immutable';
import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import {
  createMaintenanceConfig,
  createMaintenanceWindow,
  getMaintenanceConfig,
  saveMaintenanceConfig
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/api';
import {
  SETTINGS_MAINTENANCE_WINDOW_CANCEL,
  SETTINGS_MAINTENANCE_WINDOW_EDIT,
  SETTINGS_MAINTENANCE_WINDOW_NEW
} from 'in-services/tracking/eventNames';
import MaintenanceConfigurationForm from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm';
import { maintenanceWindowCTATracker } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/tracker';
import { applicationIdsToDfq, parseQuery } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/shared';
import { globalSettingsAlertingMaintenanceConfigurations } from 'in-settings/navigation/paths';
import { formatTime, formatDate, parseDateTime } from 'in-services/formatters/date';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { timeValidator, dateValidator } from 'in-services/validators/date';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { notBlankValidator } from 'in-services/validators/string';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import entityForm from 'in-hoc/entityForm';
import { t } from 'in-i18n';

import locals from './MaintenanceConfiguration.mless';

export default function MaintenanceConfiguration(props) {
  const entityId = props.match.params.id;
  const { goToPath } = useNavigation();
  return (
    <Form
      title={t('in-settings:tabs.maintenanceWindow')}
      entityId={entityId}
      createDefaultEntity={createMaintenanceConfig}
      createForm={config => createForm(config, !entityId)}
      getEntityFromApi={getMaintenanceConfig}
      openEntities={() => goToPath(globalSettingsAlertingMaintenanceConfigurations)}
      saveEntity={(config, form) => save(config, form, !entityId)}
    />
  );
}

const Form = entityForm(function MaintenanceForm(props) {
  const { entity, form, message, error, loading, isCreate } = props;
  const { goToPath } = useNavigation();
  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
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
        listPath={globalSettingsAlertingMaintenanceConfigurations}
        onClickCancelButton={() => {
          maintenanceWindowCTATracker(
            SETTINGS_MAINTENANCE_WINDOW_CANCEL,
            globalSettingsAlertingMaintenanceConfigurations
          );
          goToPath(globalSettingsAlertingMaintenanceConfigurations);
        }}
      />
    </SettingsDetailPage>
  );
});

function save(config, form, isNew) {
  const window = form.get('window');
  const windowStart = getTime(window.get('start'));
  const windowEnd = getTime(window.get('end'));

  // the query field might not exist in case 'Apply on ALL' is selected,
  // which corresponds to an empty query
  const query = getQueryFromFormField(form);

  //maintenanceWindowObjectModification(isNew ? CREATED_OBJECT : UPDATED_OBJECT, location.pathname, 'legacy');
  maintenanceWindowCTATracker(
    isNew ? SETTINGS_MAINTENANCE_WINDOW_NEW : SETTINGS_MAINTENANCE_WINDOW_EDIT,
    location.pathname
  );
  return saveMaintenanceConfig(
    createMaintenanceConfig(
      config ? config.get('id') : null,
      form.get('name').value,
      query,
      windowStart && windowEnd ? [createMaintenanceWindow(window.get('id').value, windowStart, windowEnd)] : []
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
  if (selectedApplications.length === 0) {
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
  return form.put(
    'query',
    createField({
      value: query,
      validator: notBlankValidator
    })
  );
}

function getQueryFromFormField(form) {
  const applyOnSelection = form.get('applyOn').value;
  if (form.containsKey('applicationIds') && applyOnSelection === 'application') {
    return applicationIdsToDfq(form.get('applicationIds').value);
  } else if (form.containsKey('query') && applyOnSelection === 'dfq') {
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
