/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  applicationsAlertingListAlertDeleted,
  applicationsAlertingListAlertPaused,
  applicationsAlertingListAlertResumed
} from 'in-alerting/smart-alerts/applications/tracker';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAllAlertConfigs
} from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-applications/navigation/matrix';
import EvaluationTypeColumn from 'in-alerting/smart-alerts/applications/inventory/EvaluationTypeColumn';
import ListFiltersColumn from 'in-alerting/smart-alerts/applications/inventory/ListFiltersColumn';
import { ListNameColumn } from 'in-alerting/smart-alerts/applications/inventory/ListNameColumn';
import { alertsTab, alertsTabDetailsFullyQualified } from 'in-applications/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl } from 'in-stores/navigation/navigation';
import Footer from 'in-new-components/Footer/Footer';
import List from 'in-settings/components/List';
import Card from 'in-new-components/Card';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

function getColumnDefinitions(applicationName) {
  return [
    {
      id: 'name',
      label: t('in-applications:labelName'),
      getContent(config) {
        return <ListNameColumn config={config} configsCategory="" />;
      }
    },
    {
      id: 'evaluationType',
      sortable: false,
      getContent(config) {
        return <EvaluationTypeColumn {...config} />;
      }
    },
    {
      id: 'filters',
      label: t('in-applications:labelFilters'),
      getContent(config) {
        return <ListFiltersColumn {...config} applicationName={applicationName} />;
      }
    }
  ];
}

/**
 * TODO: Will be deleted after FF "globalSmartAlertsEnabled" is removed
 */
export default function OldAlertsList({ applicationName, applicationId }) {
  const [alertsSize, setAlertsSize] = useState(null);

  // I used the lang key from in-websites here because <OldAlertsList /> will be deleted in few days
  // it would make no sense to add a key to in-alerting lang file an delete later
  let header = t('in-websites:websiteDashboard.tabs.alerts.alertsHeaderConfiguredAlerts');
  if (alertsSize != null) {
    header = `${header} (${alertsSize})`;
  }

  return (
    <>
      <Card>
        <List
          getHeader={() => header}
          getEntityName={getEntityName}
          columnDefinitions={getColumnDefinitions(applicationName)}
          tableActions={
            role.canConfigureCustomAlerts && {
              delete: {
                deleteEntity: config =>
                  deleteAlertConfig(config.id).tap(() =>
                    applicationsAlertingListAlertDeleted({
                      alertConfigId: config.id
                    })
                  )
              },
              toggleEnabled: {
                get: config => config.enabled,
                toggle: config =>
                  config.enabled
                    ? disableAlertConfig(config.id).tap(() =>
                        applicationsAlertingListAlertPaused({
                          alertConfigId: config.id
                        })
                      )
                    : enableAlertConfig(config.id).tap(() =>
                        applicationsAlertingListAlertResumed({
                          alertConfigId: config.id
                        })
                      )
              }
            }
          }
          loadEntities={() => getAllAlertConfigs(applicationId).tap(alerts => setAlertsSize(alerts.length))}
          pageSize={15}
          searchAttributes={[entity => entity.name]}
          noDataMessage={t('in-alerting:smartAlerts.applications.inventory.noAlertConfigured')}
          onRowClick={config =>
            mutateUrl(location => {
              location.pathname = alertsTabDetailsFullyQualified;
              setOrDeleteMatrixKey(location, alertsTab, alertIdMatrixParam, config.id);
              setOrDeleteMatrixKey(location, alertsTab, alertCreatedMatrixParam, config.created);
            })
          }
        />
      </Card>
      <Footer />
    </>
  );
}

OldAlertsList.propTypes = {
  applicationName: PropTypes.string.isRequired,
  applicationId: PropTypes.string.isRequired
};

function getEntityName(entity) {
  return t('in-alerting:smartAlerts.applications.inventory.alertEntityName', { entityName: entity.name });
}
