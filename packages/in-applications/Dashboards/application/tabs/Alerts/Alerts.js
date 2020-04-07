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
import { getMetricLabel, getBlueprintLabel } from 'in-applications/alerting/form/formUtils';
import { alertId as alertIdMatrixParam } from 'in-applications/navigation/matrix';
import evaluateClassNames, { joinClassNames } from 'in-services/util/classnames';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl } from 'in-stores/navigation/navigation';
import Footer from 'in-new-components/Footer/Footer';
import Tooltip from 'in-components/Tooltip/Tooltip';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import List from 'in-settings/components/List';
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
      <List
        getHeader={() => header}
        getEntityName={getEntityName}
        columnDefinitions={getColumnDefinitions(applicationName)}
        tableActions={
          role.canConfigureCustomAlerts && {
            delete: {
              deleteEntity: config =>
                deleteAlertConfig(config.id).tap(() => applicationsAlertingListAlertDeleted(config.id))
            },
            toggleEnabled: {
              get: config => config.enabled,
              toggle: config =>
                config.enabled
                  ? disableAlertConfig(config.id).tap(() => applicationsAlertingListAlertPaused(config.id))
                  : enableAlertConfig(config.id).tap(() => applicationsAlertingListAlertResumed(config.id))
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
          })
        }
      />
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
        <Tooltip themeStyle="light" content={config.description} align="topMiddle">
          <div className={joinClassNames(locals.name, locals.fullWidth)}>{config.name}</div>
        </Tooltip>
        <div className={locals.nameSubtext}>{getSubtitle(config)}</div>
      </div>
    </div>
  );
}

function getSubtitle(config) {
  const alertType = config.rule.alertType;
  return `${getBlueprintLabel(alertType)}, ${getMetricLabel(alertType, config.rule.metricName)}`;
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
      {config.tagFilters.length >= 1 && (
        <Tooltip
          themeStyle="light"
          content={<TagFilterListPresenter tagFilters={config.tagFilters} readonly />}
          align="topMiddle"
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {config.tagFilters.length} filter(s)
          </span>
        </Tooltip>
      )}
    </div>
  );
}
