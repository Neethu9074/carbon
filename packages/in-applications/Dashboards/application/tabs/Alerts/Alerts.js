/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  applicationsAlertingListAlertResumed,
  applicationsAlertingListAlertPaused,
  applicationsAlertingListAlertDeleted
} from 'in-alerting/smart-alerts/applications/tracker';
import {
  getAllAlertConfigs,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig
} from 'in-applications/api/applicationAlertConfig';
import alertEvaluationTypes, {
  PER_AP
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import AlertQueryBuilder from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { alertsTab, alertsTabDetailsFullyQualified } from 'in-applications/navigation/paths';
import { alertCreated as alertCreatedMatrixParam } from 'in-applications/navigation/matrix';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertId as alertIdMatrixParam } from 'in-applications/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl } from 'in-stores/navigation/navigation';
import Footer from 'in-new-components/Footer/Footer';
import Tooltip from 'in-components/Tooltip/Tooltip';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import List from 'in-settings/components/List';
import Card from 'in-new-components/Card';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Alerts.mless';

function getColumnDefinitions(applicationName) {
  return [
    {
      id: 'name',
      label: t('in-applications:labelName'),
      getContent: getNameContent
    },
    {
      id: 'evaluationType',
      sortable: false,
      getContent(config) {
        const { evaluationType = PER_AP } = config;
        const evaluationInfo = alertEvaluationTypes[evaluationType];
        return (
          <div className={locals.column}>
            <div className={locals.name}>{t('in-applications:alert.applicationSmartAlert')}</div>
            {evaluationInfo && <div className={locals.nameSubtext}>{evaluationInfo.columnText}</div>}
          </div>
        );
      }
    },
    {
      id: 'filters',
      label: t('in-applications:labelFilters'),
      getContent: entity => getFiltersContent(entity, applicationName)
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

function getNameContent(config) {
  return (
    <div className={classNames(locals.centered, locals.fullWidth)}>
      <SvgIcon
        className={classNames({
          [locals.alertIcon]: true,
          [locals.alertIconSeverityLow]: config.severity <= 5,
          [locals.alertIconSeverityHigh]: config.severity > 5
        })}
        type="lib_alerts_alert"
      />
      <div className={classNames(locals.column, locals.fullWidth)}>
        <Tooltip themeStyle="light" content={config.description} align="topMiddle" delay={500}>
          <div className={classNames(locals.name, locals.fullWidth)}>{config.name}</div>
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
  return t('in-applications:alert.getSubtitle', {
    blueprintConfigName: blueprintConfig.name,
    metricLabel: metricLabel
  });
}

function getFiltersContent(config, applicationName) {
  const tagFilterExpression = fromBackendModel(config.tagFilterExpression ?? []);
  const filterCount = getFiltersCount(tagFilterExpression);

  const maxFilterToDisplay = 3;
  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplay);

  return (
    <div className={locals.filters}>
      {applicationName && (
        <span
          className={classNames({
            [locals.centered]: true,
            [locals.space]: true
          })}
        >
          <SvgIcon className={locals.filterIcon} type="lib_application" />
          {applicationName}
        </span>
      )}

      {tagFilterExpression.length > 0 && (
        <Tooltip
          themeStyle="light"
          content={
            <div>
              <AlertQueryBuilder value={filtersToDisplay} readOnly />
              <span className={locals.moreFilters}>
                {filterCount > maxFilterToDisplay &&
                  t('in-applications:alert.tooltipMoreFilter', {
                    count: filterCount,
                    moreFilterCount: filterCount - maxFilterToDisplay
                  })}
              </span>
            </div>
          }
          align="topMiddle"
          delay={500}
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {t('in-applications:alert.filter', {
              count: filterCount
            })}
          </span>
        </Tooltip>
      )}
    </div>
  );
}

function getFiltersCount(tagFilterExpression) {
  return tagFilterExpression.reduce((count, element) => {
    return element.type === 'TAG_FILTER' ? count + 1 : count;
  }, 0);
}

function getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplay) {
  const filtersToDisplay = [];
  let tagFilterCount = 0;

  for (const item of tagFilterExpression) {
    if (tagFilterCount === maxFilterToDisplay) {
      break;
    }
    filtersToDisplay.push(item);

    if (item.type === 'TAG_FILTER') {
      tagFilterCount++;
    }
  }

  return filtersToDisplay;
}
