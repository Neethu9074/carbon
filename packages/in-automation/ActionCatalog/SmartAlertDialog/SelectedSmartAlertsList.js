/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { combineLatest } from '@instana/observables';

import {
  simpleListNameColumnDefinition,
  evaluationInfoColumnDefinition,
  deselectActionColumnDefinition
} from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import SelectSmartAlertsDialogButton from 'in-automation/ActionCatalog/SmartAlertDialog/SelectSmartAlertsDialogButton';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import memoize from 'in-services/util/memoizingObservableGenerator';
import SectionHeading from 'in-settings/components/SectionHeading';
import { isLoading, hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

const loadApAlertConfigs = memoize(
  entities => getAllAlertConfigsForAllApplications(entities, { asObservable: true }),
  selection => `getAllAlertConfigsForAllApplications-${selection.join('-')}`
);

export default function SelectedSmartAlertsList({ form, setForm }) {
  const title = t('in-settings:tabs.smartAlerts');
  const selection = form.get('applicationAlertConfigIds')?.value;

  return (
    <Fragment>
      <SectionHeading>{t('in-automation:ActionCatalog.ActionAssociationsForSmartAlert')}</SectionHeading>
      <List
        title={title}
        columnDefinitions={getColumnDefinitions(form, setForm)}
        loadEntities={() => loadEntities(selection)}
        searchAttributes={[getEntityName, getEntityType]}
        getHeader={defaultHeaderWithCount(title)}
        rightHeader={<RightHeader form={form} setForm={setForm} />}
        noDataMessage={t('in-settings:tabs.noSmartAlertsSelected')}
        searchPlaceholder={t('in-automation:ActionCatalog.searchSmartAlerts')}
        searchMaxWidth={350}
        isSearchable
      />
    </Fragment>
  );
}

function RightHeader({ form, setForm }) {
  return <SelectSmartAlertsDialogButton form={form} updateForm={setForm} />;
}

function loadEntities(entities) {
  return combineLatest([loadApAlertConfigs(entities)])
    .map(e => (e.some(resp => isLoading(resp) || hasError(resp)) ? null : e))
    .map(e => {
      if (e === null) {
        return e;
      }

      const [apResult] = e;
      return entities
        .map(id => {
          const apData = apResult.data?.find(({ id: i }) => i === id);
          if (apData) {
            return { config: apData, isGlobalSmartAlertConfig: false };
          }
          return undefined;
        })
        .filter(Boolean);
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
            return idx >= 0 ? f.setValue(selection.filter((e, i) => i !== idx)).setTouched(true) : f;
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
