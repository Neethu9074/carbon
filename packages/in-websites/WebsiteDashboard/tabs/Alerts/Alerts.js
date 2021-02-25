/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';

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
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertsTab, alertsTabDetailsFullyQualified } from 'in-websites/navigation/paths';
import { alertCreated as alertCreatedMatrixParam } from 'in-websites/navigation/matrix';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import { alertId as alertIdMatrixParam } from 'in-websites/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl } from 'in-stores/navigation/navigation';
import Footer from 'in-new-components/Footer/Footer';
import Tooltip from 'in-components/Tooltip/Tooltip';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import List from 'in-settings/components/List';
import Card from 'in-new-components/Card';
import { role } from 'in-stores/user';

import locals from './Alerts.mless';

function getColumnDefinitions(websiteLabel) {
  return [
    {
      id: 'name',
      label: t('in-websites:websiteDashboard.tabs.alerts.alertsLabelName'),
      getContent: getNameContent
    },
    {
      id: 'filters',
      label: t('in-websites:websiteDashboard.tabs.alerts.alertsLabelFilters'),
      getContent: entity => getFiltersContent(entity, websiteLabel)
    },
    {
      id: 'filters2',
      label: t('in-websites:websiteDashboard.tabs.alerts.alertsLabelFilters'),
      getContent: entity => getFiltersContentQB2(entity, websiteLabel)
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
  /* remove, replace by #getFilterContentQB2 */
  const pages = config.tagFilters.filter(filter => filter.name === 'beacon.page.name');
  const otherTagFiltersCount = config.tagFilters.length - pages.length;

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
      {otherTagFiltersCount >= 1 && (
        <Tooltip
          themeStyle="light"
          content={
            <TagFilterListPresenter
              tagFilters={config.tagFilters.filter(({ name }) => name !== 'beacon.page.name')}
              readonly
            />
          }
          align="topMiddle"
          delay={500}
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {t('in-websites:websiteDashboard.tabs.alerts.alertsNumberOfFilters', { count: otherTagFiltersCount })}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
function getFiltersContentQB2(config, websiteLabel) {
  const tagFilterExpressions = fromBackendModel(config.tagFilterExpression);
  const pages = tagFilterExpressions.filter(filter => filter.name === 'beacon.page.name');
  const otherTagFiltersCount = tagFilterExpressions.length - pages.length;

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
      {otherTagFiltersCount >= 1 && (
        <Tooltip
          themeStyle="light"
          content={
            <TagFilterListPresenter
              tagFilters={tagFilterExpressions.filter(({ name }) => name !== 'beacon.page.name')}
              readonly
            />
          }
          align="topMiddle"
          delay={500}
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {t('in-websites:websiteDashboard.tabs.alerts.alertsNumberOfFilters', { count: otherTagFiltersCount })}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
