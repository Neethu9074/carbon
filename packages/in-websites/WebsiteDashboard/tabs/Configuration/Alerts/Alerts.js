import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  getAllAlertConfigs,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig
} from 'in-websites/api/websiteAlertConfig';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import evaluateClassNames, { joinClassNames } from 'in-services/util/classnames';
import AlertConfigDialog from 'in-websites/eum-alerting/AlertConfigDialog';
import List, { reload } from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip/Tooltip';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './Alerts.mless';

export default function Alerts({ websiteLabel, websiteId }) {
  const [alertsSize, setAlertsSize] = useState('');
  const [config, setConfig] = useState(null);

  return (
    <>
      <List
        getHeader={() => `Configured Alerts (${alertsSize})`}
        getEntityName={config => config.name}
        columnDefinitions={getColumnDefinitions(websiteLabel)}
        tableActions={{
          delete: {
            deleteEntity: config => deleteAlertConfig(config.id)
          },
          toggleEnabled: {
            get: config => config.enabled,
            toggle: config => (config.enabled ? disableAlertConfig(config.id) : enableAlertConfig(config.id))
          }
        }}
        loadEntities={() => getAllAlertConfigs(websiteId).tap(alerts => setAlertsSize(alerts.length))}
        pageSize={15}
        searchAttributes={[entity => entity.name]}
        noDataMessage="No alert configured."
        onRowClick={config => setConfig(config)}
      />
      {config && (
        <AlertConfigDialog
          onClose={() => {
            setConfig(null);
            reload();
          }}
          formData={config}
          websiteLabel={websiteLabel}
          editMode
        />
      )}
    </>
  );
}

Alerts.propTypes = {
  websiteLabel: PropTypes.string.isRequired,
  websiteId: PropTypes.string.isRequired
};

function getColumnDefinitions(websiteLabel) {
  return [
    {
      id: 'name',
      label: 'Name',
      getContent: getNameContent
    },
    {
      id: 'filters',
      label: 'Filters',
      getContent: entity => getFiltersContent(entity, websiteLabel)
    }
  ];
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
        size="xxxs"
        type="lib_alerts_alert"
      />
      <div className={joinClassNames(locals.column, locals.fullWidth)}>
        <Tooltip themeStyle="light" content={config.name} align="topMiddle">
          <div className={joinClassNames(locals.name, locals.fullWidth)}>{config.name}</div>
        </Tooltip>
        <div className={locals.nameSubtext}>Specific JS Error, string pattern</div>
      </div>
    </div>
  );
}

function getFiltersContent(config, websiteLabel) {
  const pages = config.tagFilters.filter(filter => filter.name === 'beacon.page.name');

  return (
    <div className={locals.filters}>
      {websiteLabel && (
        <span
          className={evaluateClassNames({
            [locals.centered]: true,
            [locals.space]: pages.length === 0,
            [locals.devider]: pages.length > 0
          })}
        >
          <SvgIcon className={locals.filterIcon} size="xxxs" type="lib_website" />
          {websiteLabel}
        </span>
      )}
      {pages &&
        pages.map((page, i) => (
          <span className={joinClassNames(locals.centered, locals.space)} key={i}>
            <SvgIcon className={locals.filterIcon} size="xxxs" type="lib_website_page_load" />
            {page.stringValue}
          </span>
        ))}
      {config.tagFilters.length > 1 && (
        <Tooltip
          themeStyle="light"
          content={
            <TagFilterListPresenter
              tagFilters={config.tagFilters.filter(({ name }) => name !== 'beacon.page.name')}
              readonly
            />
          }
          align="topMiddle"
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} size="xxxs" type="lib_actions_filter" />
            {config.tagFilters.length - pages.length} filter(s)
          </span>
        </Tooltip>
      )}
    </div>
  );
}
