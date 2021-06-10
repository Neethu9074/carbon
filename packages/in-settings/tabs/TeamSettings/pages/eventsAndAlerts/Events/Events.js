/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState } from 'react';
import classNames from 'classnames';

import { Link } from '@instana/components';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingEventBuiltIn,
  teamSettingsAlertingEventCustom,
  teamSettingsAlertingEventCustomNew
} from 'in-settings/navigation/paths';
import {
  getEventSpecificationsMutable,
  deleteCustomEventSpecification,
  setBuiltInEventSpecificationsEnabled,
  setCustomEventSpecificationsEnabled
} from 'in-api/eventSpecifications';
import {
  customEnumValue,
  builtInEnumValue,
  getEntityTypeOptions,
  isBuiltInRule
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import List, { createNewEntityButton, leftHeaderWithSelectAll } from 'in-settings/components/List';
import { getSeverityText } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { openEventSubmitFormTracker, viewEventTracker } from 'in-settings/tracker';
import { deprecateAppDataLegacyEvents } from 'in-services/featureFlags';
import WithSubscript from 'in-settings/components/WithSubscript';
import { intersperse } from 'in-services/arrayUtils';
import { getPluginName } from 'in-sdk/pluginName';
import WithIcon from 'in-components/WithIcon';
import ComboBox from 'in-components/ComboBox';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Events.mless';

const typeOptions = [
  { value: builtInEnumValue, label: t('in-settings:tabs.builtIn') },
  { value: customEnumValue, label: t('in-settings:tabs.custom') }
];

const arbitrarySeverityForIncidentsFilter = -13;
const severityOptions = [
  { value: arbitrarySeverityForIncidentsFilter, label: t('in-settings:tabs.incidents') },
  { value: 5, label: t('in-settings:tabs.warning') },
  { value: 10, label: t('in-settings:tabs.critical') }
];

const entityTypeOptions = getEntityTypeOptions();

const enabledOptions = Object.freeze([
  { value: true, label: t('in-settings:tabs.enabled') },
  { value: false, label: t('in-settings:tabs.disabled') }
]);

export default function Events({
  setTitle = true,
  tableActions = defaultTableActions,
  loadEntities,
  noDataMessage,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = true,
  inSelectListDialog = false,
  getHeader = defaultGetHeader(inSelectListDialog, tableActions)
}) {
  const [type, setType] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [entityType, setEntityType] = useState(null);
  const [enabled, setEnabled] = useState(null);

  return (
    <List
      title={setTitle ? t('in-settings:tabs.events') : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getEventSpecificationsMutable}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={getRightHeader()}
      isSearchable={isSearchable}
      searchAttributes={['name', 'description', getEntityType]}
      extraFilters={createFilters(hiddenIds, type, severity, entityType, enabled)}
      extraFilterValues={{ type, severity, entityType, enabled }}
      searchPlaceholder={t('in-settings:tabs.filterEvents')}
      searchMaxWidth={210}
      onRowClick={onRowClick}
      getDetailsHref={
        onRowClick || !hasRowNavigation ? null : entity => getEntityHref(getDetailsPath(entity), entity.id)
      }
    />
  );

  function getRightHeader() {
    return !inSelectListDialog ? rightHeader ?? defaultRightHeader() : inSelectListDialogRightHeader();
  }

  function defaultRightHeader() {
    return (
      <Fragment>
        {createNewEntityButton({
          labelNew: t('in-settings:tabs.newEvent'),
          pathNew: teamSettingsAlertingEventCustomNew,
          trackEvent: openEventSubmitFormTracker
        })}
        {inSelectListDialogRightHeader()}
      </Fragment>
    );
  }

  function inSelectListDialogRightHeader() {
    return (
      <Fragment>
        <ComboBox
          name="filter-type"
          value={type}
          options={typeOptions}
          onChange={e => (e ? setType(e.value) : setType(null))}
          placeholder={t('in-settings:tabs.type')}
          className={locals.filterDropdown}
        />
        <ComboBox
          name="filter-severity"
          value={severity}
          options={severityOptions}
          onChange={e => (e ? setSeverity(e.value) : setSeverity(null))}
          placeholder={t('in-settings:tabs.incidentsSeverity')}
          className={classNames(locals.severityDropdown, locals.filterDropdown)}
        />
        <ComboBox
          name="filter-entity-type"
          value={entityType}
          options={entityTypeOptions}
          onChange={e => (e ? setEntityType(e.value) : setEntityType(null))}
          placeholder={t('in-settings:tabs.entityType')}
          className={classNames(locals.entityTypeDropdown, locals.filterDropdown)}
        />
        <ComboBox
          name="filter-enabled"
          value={enabled}
          options={enabledOptions}
          onChange={e => (e ? setEnabled(e.value) : setEnabled(null))}
          placeholder={t('in-settings:tabs.state')}
          className={locals.stateDropdown}
        />
      </Fragment>
    );
  }
}

function columnDefinitions(hasRowNavigation) {
  return [
    {
      id: 'name',
      label: t('in-settings:tabs.name'),
      width: 40,
      getContent(entity) {
        const icon = getIcon(entity);

        return (
          <WithIcon icon={icon.icon} iconColor={icon.color}>
            <Tooltip content={entity.name} align="topLeft" delay={500}>
              <WithSubscript subscript={<Subscript entity={entity} />}>
                {hasRowNavigation ? (
                  <Link
                    href$={getEntityIdView(getDetailsPath(entity), entity.id)}
                    ellipsis
                    onClick={() =>
                      viewEventTracker({
                        eventDefinitionType: entity.type,
                        entityType: entity.entityType,
                        type: entity.triggering ? 'Incident' : 'None',
                        severity: getSeverityText(entity.severity)
                      })
                    }
                  >
                    {entity.name}
                  </Link>
                ) : (
                  <span className={locals.ellipsis}>{entity.name}</span>
                )}
              </WithSubscript>
            </Tooltip>
          </WithIcon>
        );
      },
      getValue(entity) {
        return entity.name;
      }
    },
    {
      id: 'description',
      label: t('in-settings:tabs.description'),
      width: 40,
      getContent(entity) {
        return <div className={locals.fourLines}>{entity.description}</div>;
      }
    },
    {
      id: 'entityType',
      label: t('in-settings:tabs.entityType'),
      width: 20,
      getContent(entity) {
        if (entity.entityType === 'any') {
          return '';
        }
        return (
          <Tooltip content={getPluginName(entity.entityType, 1)} align="topLeft" delay={500}>
            <WithIcon plugin={entity.entityType} iconColor={theme.lib.colors.N700Medium}>
              {getPluginName(entity.entityType, 1)}
            </WithIcon>
          </Tooltip>
        );
      },
      getValue: getEntityType
    }
  ];
}

const defaultTableActions = {
  toggleEnabled: {
    get: isEnabled,
    toggle: entity => {
      if (isBuiltInRule(entity)) {
        return setBuiltInEventSpecificationsEnabled(entity.id, !entity.enabled);
      } else {
        return setCustomEventSpecificationsEnabled(entity.id, !entity.enabled);
      }
    }
  },
  delete: {
    deleteEntity: entity => deleteCustomEventSpecification(entity.id),
    deleteProtection: entity => isBuiltInRule(entity)
  }
};

function isEnabled(entity) {
  return entity.enabled;
}

function defaultGetHeader(inSelectListDialog, tableActions) {
  return leftHeaderWithSelectAll(t('in-settings:tabs.events'), inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return `event ${entity.name}`;
}

function getIcon(entity) {
  if (entity.enabled === false) {
    return { icon: 'lib_actions_pause', color: theme.lib.colors.N400 };
  }

  let icon = 'lib_events_change';
  let color = theme.lib.colors.N400;
  if (entity.severity >= 1 && entity.severity <= 5) {
    icon = 'lib_events_critical';
    color = theme.lib.colors.yellow800;
  } else if (entity.severity > 5) {
    icon = 'lib_events_warning';
    color = theme.lib.colors.red800;
  }
  if (entity.triggering) {
    icon = 'lib_events_incident';
  }

  return { icon, color };
}

function getDetailsPath(entity) {
  return isBuiltInRule(entity) ? teamSettingsAlertingEventBuiltIn : teamSettingsAlertingEventCustom;
}

function getEntityType(entity) {
  if (entity.entityType === 'any') {
    return '';
  }
  return getPluginName(entity.entityType, 1);
}

function Subscript({ entity }) {
  return (
    <Fragment>
      {intersperse(
        [showBuiltIn(), showDisabled(), showInvalid(), showDeprecated()].filter(elem => elem),
        i => (
          <span key={`comma-${i}`}>, </span>
        )
      )}
    </Fragment>
  );

  function showBuiltIn() {
    return isBuiltInRule(entity) ? <span key="built-in">{t('in-settings:tabs.builtIn')}</span> : null;
  }

  function showDisabled() {
    return entity.enabled === false ? <span key="disabled">{t('in-settings:tabs.disabled')}</span> : null;
  }

  function showInvalid() {
    return entity.invalid ? (
      <span key="invalid" className={locals.invalid}>
        {t('in-settings:tabs.invalidQuery')}
      </span>
    ) : null;
  }

  function showDeprecated() {
    return deprecateAppDataLegacyEvents && isAppDataEntityType() ? (
      <span key="deprecated" className={locals.deprecated}>
        {t('in-settings:tabs.deprecated')}
      </span>
    ) : null;
  }

  function isAppDataEntityType() {
    const { entityType } = entity;

    return entityType === 'application' || entityType === 'service' || entityType === 'endpoint';
  }
}

function createFilters(hiddenIds, type, severity, entityType, enabled) {
  const filters = [];

  if (hiddenIds) {
    filters.push(entity => hiddenIds.indexOf(entity.id) < 0);
  }

  if (type) {
    filters.push(entity => entity.type === type);
  }

  if (severity === arbitrarySeverityForIncidentsFilter) {
    filters.push(entity => entity.triggering);
  } else if (severity) {
    filters.push(entity => entity.severity === severity);
  }

  if (entityType) {
    filters.push(entity => entity.entityType === entityType);
  }

  if (enabled != null) {
    filters.push(entity => entity.enabled === enabled);
  }

  return filters;
}
