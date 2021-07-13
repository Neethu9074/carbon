/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { combineLatest } from '@instana/observables';

import {
  simpleListNameColumnDefinition,
  evaluationInfoColumnDefinition,
  deselectActionColumnDefinition
} from 'in-alerting/smart-alerts/applications/components/list/columns/columnDefinitions';
import SelectSmartAlertsDialogButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/SelectSmartAlertsDialogButton';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getAllGlobalAlertConfigs } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { isLoading, hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

const loadApAlertConfigs = memoize(
  () => getAllAlertConfigsForAllApplications({ asObservable: true }),
  selection => `getAllAlertConfigsForAllApplications-${selection.join('-')}`
);
const loadGlobalAlertConfigs = memoize(
  () => getAllGlobalAlertConfigs({ asObservable: true }),
  selection => `getAllGlobalAlertConfigs-${selection.join('-')}`
);

export default function SelectedSmartAlertsList({ form, setForm }) {
  const title = t('in-settings:tabs.smartAlerts');
  const selection = form.get('applicationAlertConfigIds')?.value.toJS();

  return (
    <List
      title={title}
      columnDefinitions={getColumnDefinitions(form, setForm)}
      loadEntities={() => loadEntities(selection)}
      searchAttributes={[getEntityName, getEntityType]}
      getHeader={defaultHeaderWithCount(title)}
      rightHeader={<RightHeader form={form} setForm={setForm} />}
      noDataMessage={t('in-settings:tabs.noSmartAlertsSelected')}
      searchPlaceholder={t('in-settings:tabs.filter')}
      isSearchable
    />
  );
}

function RightHeader({ form, setForm }) {
  return <SelectSmartAlertsDialogButton form={form} updateForm={setForm} />;
}

function loadEntities(entities) {
  return combineLatest([loadApAlertConfigs(entities), loadGlobalAlertConfigs(entities)])
    .map(e => (e.some(resp => isLoading(resp) || hasError(resp)) ? null : e))
    .map(e => {
      if (e === null) {
        return e;
      }

      const [apResult, globalResult] = e;
      return entities.map(id => {
        const apData = apResult.data?.find(({ id: i }) => i === id);
        if (apData) {
          return { config: apData, isGlobalSmartAlertConfig: false };
        }
        const globalData = globalResult.data?.find(({ id: i }) => i === id);
        return { config: globalData, isGlobalSmartAlertConfig: true };
      });
    });
}

function getColumnDefinitions(form, updateForm) {
  return [
    simpleListNameColumnDefinition('70%'),
    evaluationInfoColumnDefinition('20%'),
    deselectActionColumnDefinition(
      id =>
        updateForm(
          form.updateIn(['applicationAlertConfigIds'], f => {
            const selection = f.value;
            const idx = selection.findIndex(config => config === id);
            return idx >= 0 ? f.setValue(selection.remove(idx)).setTouched(true) : f;
          })
        ),
      '5%'
    )
  ];
}

function getEntityName({ config }) {
  return config.name;
}

function getEntityType({ config, isGlobalSmartAlertConfig }) {
  const { evaluationType } = config;
  // Importing string values from in-alerting here to ensure search operates on the same string displayed in the column
  const type = isGlobalSmartAlertConfig
    ? t('in-alerting:smartAlerts.globalApplicationSmartAlert')
    : t('in-alerting:smartAlerts.applicationSmartAlert');
  const evaluationInfo = alertEvaluationTypes[evaluationType];
  return `${type} ${evaluationInfo.columnText}`;
}

SelectedSmartAlertsList.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired
};
