import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  applicationsAlertingListAlertResumed,
  applicationsAlertingListAlertPaused,
  applicationsAlertingListAlertDeleted
} from 'in-applications/alerting/tracker';
import {
  getAllAlertConfigs,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig
} from 'in-applications/api/applicationAlertConfig';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { alertsTab, alertsTabDetailsFullyQualified } from 'in-applications/navigation/paths';
import { alertCreated as alertCreatedMatrixParam } from 'in-applications/navigation/matrix';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { alertId as alertIdMatrixParam } from 'in-applications/navigation/matrix';
import evaluateClassNames, { joinClassNames } from 'in-services/util/classnames';
import WithQB1orQB2 from 'in-new-components/Alerting/components/WithQB1orQB2';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl } from 'in-stores/navigation/navigation';
import Footer from 'in-new-components/Footer/Footer';
import Tooltip from 'in-components/Tooltip/Tooltip';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import List from 'in-settings/components/List';
import Card from 'in-new-components/Card';
import { role } from 'in-stores/user';

import locals from './Alerts.mless';

function getColumnDefinitions(applicationName) {
  return [
    {
      id: 'name',
      label: 'Name',
      getContent: getNameContent
    },
    {
      id: 'filters',
      label: 'Filters',
      getContent: entity => getFiltersContent(entity, applicationName)
    }
  ];
}

export default function Alerts({ applicationName, applicationId }) {
  const [alertsSize, setAlertsSize] = useState(null);

  let header = 'Configured Alerts';
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
          noDataMessage="No alert configured."
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
  return `alert "${entity.name}"`;
}

function getNameContent(config) {
  return (
    <div className={joinClassNames(locals.centered, locals.fullWidth)}>
      <SvgIcon
        className={evaluateClassNames({
          [locals.alertIcon]: true,
          [locals.alertIconSeverityLow]: config.severity <= 5,
          [locals.alertIconSeverityHigh]: config.severity > 5
        })}
        type="lib_alerts_alert"
      />
      <div className={joinClassNames(locals.column, locals.fullWidth)}>
        <Tooltip themeStyle="light" content={config.description} align="topMiddle" delay={500}>
          <div className={joinClassNames(locals.name, locals.fullWidth)}>{config.name}</div>
        </Tooltip>
        <div className={locals.nameSubtext}>{getSubtitle(config)}</div>
      </div>
    </div>
  );
}

function getSubtitle(alertConfig) {
  const alertType = alertConfig.rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricLabel = blueprintConfig.getMetricLabel(alertConfig.rule.metricName);
  return `${blueprintConfig.name}, ${metricLabel}`;
}

function getFiltersContent(config, applicationName) {
  return (
    <div className={locals.filters}>
      {applicationName && (
        <span
          className={evaluateClassNames({
            [locals.centered]: true,
            [locals.space]: true
          })}
        >
          <SvgIcon className={locals.filterIcon} type="lib_application" />
          {applicationName}
        </span>
      )}

      <WithQB1orQB2
        onUsesQB1={() =>
          config.tagFilters?.length >= 1 ? (
            <Tooltip
              themeStyle="light"
              content={<TagFilterListPresenter tagFilters={config.tagFilters} readonly />}
              align="topMiddle"
              delay={500}
            >
              <span className={locals.centered}>
                <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
                {config.tagFilters.length} filter(s)
              </span>
            </Tooltip>
          ) : null
        }
        onUsesQB2={() => {
          return (
            config.tagFilterExpression.length > 0 && (
              <Tooltip
                themeStyle="light"
                content={<AlertQueryBuilder value={config.tagFilterExpression} readOnly />}
                align="topMiddle"
                delay={500}
              >
                <span className={locals.centered}>
                  <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
                  Filters
                </span>
              </Tooltip>
            )
          );
        }}
      />
    </div>
  );
}
