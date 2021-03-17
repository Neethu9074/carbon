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
        return <ListNameColumn {...config} />;
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

export default function Alerts({ applicationName, applicationId }) {
  const [alertsSize, setAlertsSize] = useState(null);

  let header = t('in-applications:alert.headerConfiguredAlerts');
  if (alertsSize != null) {
    header = t('in-applications:alert.headerConfiguredAlertsNum', {
      headerConfigAlerts: header,
      alertsSize: alertsSize
    });
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
          noDataMessage={t('in-applications:alert.noAlertConfigured')}
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

Alerts.propTypes = {
  applicationName: PropTypes.string.isRequired,
  applicationId: PropTypes.string.isRequired
};

function getEntityName(entity) {
  return t('in-applications:alert.getEntityName', {
    entityName: entity.name
  });
}
