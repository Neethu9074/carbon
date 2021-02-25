/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';

import {
  websitesAlertingListAlertResumed,
  websitesAlertingListAlertPaused,
  websitesAlertingListAlertDeleted
} from 'in-websites/alerting/tracker';
import {
  getAllAlertConfigs,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig
} from 'in-websites/api/websiteAlertConfig';
import { alertCreated as alertCreatedMatrixParam, alertId as alertIdMatrixParam } from 'in-websites/navigation/matrix';
import { createBoundedAlertQueryBuilder } from 'in-websites/alerting/components/AlertQueryBuilder';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertsTab, alertsTabDetailsFullyQualified } from 'in-websites/navigation/paths';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
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

function getColumnDefinitions(websiteLabel) {
  return [
    {
      id: 'name',
      label: t('in-websites:websiteDashboard.tabs.alerts.alertsLabelName'),
      getContent: getNameContent
    },
    {
      id: 'filters2',
      label: t('in-websites:websiteDashboard.tabs.alerts.alertsLabelFilters'),
      getContent: entity => getFiltersContent(entity, websiteLabel)
    }
  ];
}

export default function Alerts({ websiteLabel, websiteId }) {
  const [alertsSize, setAlertsSize] = useState(null);

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
          columnDefinitions={getColumnDefinitions(websiteLabel)}
          tableActions={
            role.canConfigureCustomAlerts && {
              delete: {
                deleteEntity: config =>
                  deleteAlertConfig(config.id).tap(() => websitesAlertingListAlertDeleted({ id: config.id }))
              },
              toggleEnabled: {
                get: config => config.enabled,
                toggle: config =>
                  config.enabled
                    ? disableAlertConfig(config.id).tap(() => websitesAlertingListAlertPaused({ id: config.id }))
                    : enableAlertConfig(config.id).tap(() => websitesAlertingListAlertResumed({ id: config.id }))
              }
            }
          }
          loadEntities={() => getAllAlertConfigs(websiteId).tap(alerts => setAlertsSize(alerts.length))}
          pageSize={15}
          searchAttributes={[entity => entity.name]}
          noDataMessage={t('in-websites:websiteDashboard.tabs.alerts.alertsNoDataMessage')}
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
  websiteLabel: PropTypes.string.isRequired,
  websiteId: PropTypes.string.isRequired
};

function getEntityName(entity) {
  return `alert "${entity.name}"`;
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
  return `${blueprintConfig.name}, ${metricLabel}`;
}

function getFiltersContent(config, websiteLabel) {
  const tagFilterExpression = fromBackendModel(config.tagFilterExpression ?? []);
  const pages = tagFilterExpression.filter(filter => filter.name === 'beacon.page.name');
  const otherTagFiltersCount = tagFilterExpression.length - pages.length;

  const filterCount = getFiltersCount(tagFilterExpression);

  const maxFilterToDisplay = 3;
  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplay);

  const blueprintConfig = getBlueprintConfig(config.rule.alertType);
  const websiteId = config.websiteId;
  const beaconType = blueprintConfig.getBeaconType(config.rule.metricName);
  const { QueryBuilder } = useMemo(() => createBoundedAlertQueryBuilder(websiteId, beaconType), [
    websiteId,
    beaconType
  ]);

  return (
    <div className={locals.filters}>
      {websiteLabel && (
        <span
          className={classNames({
            [locals.centered]: true,
            [locals.space]: pages.length === 0,
            [locals.devider]: pages.length > 0
          })}
        >
          <SvgIcon className={locals.filterIcon} type="lib_website" />
          {websiteLabel}
        </span>
      )}
      {pages &&
        pages.map((page, i) => (
          <span className={classNames(locals.centered, locals.space)} key={i}>
            <SvgIcon className={locals.filterIcon} type="lib_website_page_load" />
            {page.stringValue}
          </span>
        ))}
      {otherTagFiltersCount >= 1 && tagFilterExpression.length > 0 && (
        <Tooltip
          themeStyle="light"
          content={
            <div>
              <QueryBuilder value={filtersToDisplay} readOnly />
              <span className={locals.moreFilters}>
                {filterCount > maxFilterToDisplay &&
                  `+${filterCount - maxFilterToDisplay} more ${pluralize('filter', filterCount, false)}`}
              </span>
            </div>
          }
          align="topMiddle"
          delay={500}
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {pluralize('filter', filterCount, true)}
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
