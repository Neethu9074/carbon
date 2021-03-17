/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { combineLatest } from '@instana/observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// TODO: move to in-alerting if possible
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-applications/navigation/matrix';
// TODO: move to in-alerting if possible
import { alertsTab, alertsTabDetailsFullyQualified } from 'in-applications/navigation/paths';
import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getAllGlobalAlertConfigs } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import SortingConfigurator from 'in-new-components/SortingConfigurator/SortingConfigurator';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { compareIgnoreCase } from 'in-services/util/string';
import EvaluationTypeColumn from './EvaluationTypeColumn';
import ButtonGroup from 'in-new-components/ButtonGroup';
import ListActionsColumn from './ListActionsColumn';
import ListFiltersColumn from './ListFiltersColumn';
import { ListNameColumn } from './ListNameColumn';
import { mutateUrl } from 'in-stores/navigation';
import List from 'in-settings/components/List';
import { t } from 'in-i18n';

import locals from './SmartAlertsBaseList.mless';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-alerting:smartAlerts.applications.inventory.labelName'),
    width: '35%',
    widthInAbsoluteUnit: true,
    sortable: false,
    getContent(config) {
      return <ListNameColumn {...config} />;
    }
  },
  {
    id: 'evaluationInfo',
    sortable: false,
    getContent(config) {
      return <EvaluationTypeColumn {...config} />;
    }
  },
  {
    id: 'filters',
    label: t('in-alerting:smartAlerts.applications.inventory.labelFilters'),
    sortable: false,
    getContent(config) {
      return <ListFiltersColumn {...config} />;
    }
  },
  {
    id: 'actions',
    width: '15%',
    widthInAbsoluteUnit: true,
    sortable: false,
    getContent(config) {
      return <ListActionsColumn config={config} />;
    }
  }
];

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Blueprint', value: 'blueprint' },
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Severity', value: 'severity' },
  { label: 'Date created', value: 'created' }
];

export default function SmartAlertsBaseList({ onNoData }) {
  const [localSmartAlertsSelected, setLocalSmartAlertsSelected] = useState(true);
  const [numberOfGlobalSmartAlerts, setNumberOfGlobalAlerts] = useState(0);
  const [numberOfLocalSmartAlerts, setNumberOfLocalAlerts] = useState(0);
  const [orderBy, setOrderBy] = useState({
    by: sortOptions[0].value,
    direction: 'ASC'
  });

  return (
    <List
      title={t('in-alerting:smartAlerts.applications.inventory.titleSmartAlerts')}
      getCustomHeader={() => (
        <div className={locals.buttonGroupWrapper}>
          <ButtonGroup
            segmented
            buttonPropsList={[
              {
                text: t('in-alerting:smartAlerts.applications.inventory.labelGlobalSmartAlertsList', {
                  numberOfAlerts: numberOfGlobalSmartAlerts
                }),
                key: '1',
                onClick() {
                  setLocalSmartAlertsSelected(false);
                }
              },
              {
                text: t('in-alerting:smartAlerts.applications.inventory.labelSmartAlertsList', {
                  numberOfAlerts: numberOfLocalSmartAlerts
                }),
                key: '2',
                onClick() {
                  setLocalSmartAlertsSelected(true);
                }
              }
            ]}
            activeKey={localSmartAlertsSelected ? '2' : '1'}
          />
        </div>
      )}
      rightHeader={
        <div className={locals.sortWidgetWrapper}>
          <SortingConfigurator
            options={sortOptions}
            orderBy={orderBy}
            onChange={newOrderBy => setOrderBy(newOrderBy)}
          />
        </div>
      }
      getEntityName={({ name: entityName }) =>
        t('in-alerting:smartAlerts.applications.inventory.alertEntityName', { entityName })
      }
      columnDefinitions={columnDefinitions}
      customSortEntities={customSorters(orderBy)}
      loadEntities={() => {
        return combineLatest([getAllAlertConfigsForAllApplications(), getAllGlobalAlertConfigs()]).map(
          ([localAlertConfigs = null, globalAlertConfigs = null]) => {
            const localAlertsLength = localAlertConfigs?.length ?? 0;
            const globalAlertsLength = globalAlertConfigs?.length ?? 0;

            if (!localAlertsLength && !globalAlertsLength) {
              onNoData?.();
            }

            setNumberOfLocalAlerts(localAlertsLength);
            setNumberOfGlobalAlerts(globalAlertsLength);

            return localSmartAlertsSelected ? localAlertConfigs : globalAlertConfigs;
          }
        );
      }}
      pageSize={15}
      searchAttributes={[entity => entity.name]}
      noDataMessage={t('in-alerting:smartAlerts.applications.inventory.titleSmartAlerts')}
      onRowClick={config =>
        mutateUrl(location => {
          location.pathname = alertsTabDetailsFullyQualified;
          setOrDeleteMatrixKey(location, alertsTab, alertIdMatrixParam, config.id);
          setOrDeleteMatrixKey(location, alertsTab, alertCreatedMatrixParam, config.created);
        })
      }
    />
  );
}

SmartAlertsBaseList.propTypes = {
  /**
   * Callback which is (only) called if there is no data to render.
   */
  onNoData: PropTypes.func
};

function customSorters(orderBy) {
  return ({ entities }) => {
    const sorted = entities.sort((a, b) => {
      if (orderBy.by === 'name') {
        return orderBy.direction === 'ASC' ? compareIgnoreCase(a.name, b.name) : compareIgnoreCase(b.name, a.name);
      }
      if (orderBy.by === 'blueprint') {
        return orderBy.direction === 'ASC'
          ? compareIgnoreCase(a.rule.alertType, b.rule.alertType)
          : compareIgnoreCase(b.rule.alertType, a.rule.alertType);
      }
      if (orderBy.by === 'severity') {
        return orderBy.direction === 'ASC' ? a.severity - b.severity : b.severity - a.severity;
      }
      if (orderBy.by === 'created') {
        return orderBy.direction === 'ASC' ? a.created - b.created : b.created - a.created;
      }
      if (orderBy.by === 'enabled') {
        return orderBy.direction === 'ASC' ? b.enabled - a.enabled : a.enabled - b.enabled;
      }
      if (orderBy.by === 'disabled') {
        return orderBy.direction === 'ASC' ? a.enabled - b.enabled : b.enabled - a.enabled;
      }
    });

    return sorted;
  };
}
