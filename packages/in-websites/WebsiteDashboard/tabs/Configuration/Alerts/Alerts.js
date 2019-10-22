import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  getAllAlertConfigs,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig
} from 'in-websites/api/websiteAlertConfig';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import SimpleAlertDialog from 'in-websites/AlertConfigDialog/simple/SimpleAlertDialog';
import evaluateClassNames, { joinClassNames } from 'in-services/util/classnames';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import List, { reload } from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip/Tooltip';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './Alerts.mless';

export default function Alerts({ websiteLabel, websiteId }) {
  const [alertsSize, setAlertsSize] = useState('');

  return (
    <List
      getHeader={() => `Configured Alerts (${alertsSize})`}
      getEntityName={entity => entity.name}
      columnDefinitions={getColumnDefinitions(websiteLabel)}
      tableActions={{
        delete: {
          deleteEntity: entity => deleteAlertConfig(entity.id)
        },
        toggleEnabled: {
          get: entity => entity.enabled,
          toggle: entity => (entity.enabled ? disableAlertConfig(entity.id) : enableAlertConfig(entity.id))
        }
      }}
      loadEntities={() => getAllAlertConfigs(websiteId).tap(alerts => setAlertsSize(alerts.length))}
      pageSize={15}
      searchAttributes={[entity => entity.name]}
      noDataMessage="No alert configured."
      onRowClick={config =>
        setActiveDialog(
          <SimpleAlertDialog
            onClose={() => {
              close();
              reload();
            }}
            formData={config}
            websiteLabel={websiteLabel}
            editMode
          />
        )
      }
    />
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

function getNameContent(entity) {
  return (
    <div className={joinClassNames(locals.centered, locals.fullWidth)}>
      <SvgIcon className={locals.alertIcon} size="xxxs" type="lib_alerts_alert" />
      <div className={joinClassNames(locals.column, locals.fullWidth)}>
        <Tooltip themeStyle="light" content={entity.name} align="topMiddle">
          <div className={joinClassNames(locals.name, locals.fullWidth)}>{entity.name}</div>
        </Tooltip>
        <div className={locals.nameSubtext}>Specific JS Error, string pattern</div>
      </div>
    </div>
  );
}

function getFiltersContent(entity, websiteLabel) {
  const pages = entity.tagFilters.filter(filter => filter.name === 'beacon.page.name');

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
      {entity.tagFilters.length > 1 && (
        <Tooltip
          themeStyle="light"
          content={
            <TagFilterListPresenter
              tagFilters={entity.tagFilters.filter(({ name }) => name !== 'beacon.page.name')}
              readonly
            />
          }
          align="topMiddle"
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} size="xxxs" type="lib_actions_filter" />
            {entity.tagFilters.length - pages.length} filter(s)
          </span>
        </Tooltip>
      )}
    </div>
  );
}
