import { withState, compose } from 'recompose';
import React, { Fragment } from 'react';

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
import WithSubscript from 'in-settings/components/WithSubscript';
import classNames from 'classnames';
import { intersperse } from 'in-services/arrayUtils';
import WithIcon from 'in-new-components/WithIcon';
import { getSingular } from 'in-sdk/pluginName';
import ComboBox from 'in-components/ComboBox';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
import theme from 'in-themes';

import locals from './Events.mless';

const typeOptions = [
  { value: builtInEnumValue, label: 'Built-in' },
  { value: customEnumValue, label: 'Custom' }
];

const arbitrarySeverityForIncidentsFilter = -13;
const severityOptions = [
  { value: arbitrarySeverityForIncidentsFilter, label: 'Incidents' },
  { value: 5, label: 'Warning' },
  { value: 10, label: 'Critical' }
];

const entityTypeOptions = getEntityTypeOptions();

const enabledOptions = Object.freeze([
  { value: true, label: 'Enabled' },
  { value: false, label: 'Disabled' }
]);

export default compose(
  withState('type', 'setType', null),
  withState('severity', 'setSeverity', null),
  withState('entityType', 'setEntityType', null),
  withState('enabled', 'setEnabled', null)
)(Events);

function Events({
  type,
  setType,
  severity,
  setSeverity,
  entityType,
  setEntityType,
  enabled,
  setEnabled,
  setTitle = true,
  scrollWrapperClassName,
  tableActions = defaultTableActions,
  loadEntities,
  noDataMessage,
  hiddenIds,
  pageSize = 20,
  rightHeader = defaultRightHeader(
    type,
    setType,
    severity,
    setSeverity,
    entityType,
    setEntityType,
    enabled,
    setEnabled
  ),
  isSearchable = true,
  onRowClick,
  hasRowNavigation = true,
  inSelectListDialog = false,
  getHeader = defaultGetHeader(inSelectListDialog, tableActions)
}) {
  return (
    <List
      title={setTitle ? 'Events' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      scrollWrapperClassName={scrollWrapperClassName}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getEventSpecificationsMutable}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={
        !inSelectListDialog
          ? rightHeader
          : inSelectListDialogRightHeader(
              type,
              setType,
              severity,
              setSeverity,
              entityType,
              setEntityType,
              enabled,
              setEnabled
            )
      }
      isSearchable={isSearchable}
      searchAttributes={['name', 'description', getEntityType]}
      extraFilters={createFilters(hiddenIds, type, severity, entityType, enabled)}
      extraFilterValues={{ type, severity, entityType, enabled }}
      searchPlaceholder="Filter Events…"
      searchMaxWidth={210}
      onRowClick={onRowClick}
      getDetailsHref={
        onRowClick || !hasRowNavigation ? null : entity => getEntityHref(getDetailsPath(entity), entity.id)
      }
    />
  );
}

function columnDefinitions(hasRowNavigation) {
  return [
    {
      id: 'name',
      label: 'Name',
      width: 40,
      getContent(entity) {
        const icon = getIcon(entity);
        return (
          <WithIcon icon={icon.icon} iconColor={icon.color}>
            <Tooltip content={entity.name} align="topLeft" delay={500}>
              <WithSubscript subscript={getSubscript(entity)}>
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
      label: 'Description',
      width: 40,
      getContent(entity) {
        return <div className={locals.fourLines}>{entity.description}</div>;
      }
    },
    {
      id: 'entityType',
      label: 'Entity Type',
      width: 20,
      getContent(entity) {
        if (entity.entityType === 'any') {
          return '';
        }
        return (
          <Tooltip content={getSingular(entity.entityType)} align="topLeft" delay={500}>
            <WithIcon plugin={entity.entityType} iconColor={theme.lib.colors.N700Medium}>
              {getSingular(entity.entityType)}
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
  return leftHeaderWithSelectAll('Events', inSelectListDialog, tableActions);
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
  return getSingular(entity.entityType);
}

function getSubscript(entity) {
  return (
    <Fragment>
      {intersperse(
        [
          isBuiltInRule(entity) ? <span key="built-in">Built-in</span> : null,
          entity.enabled === false ? <span key="disabled">Disabled</span> : null,
          entity.invalid ? (
            <span key="invalid" className={locals.invalid}>
              Invalid Query
            </span>
          ) : null
        ].filter(elem => elem),
        i => (
          <span key={`comma-${i}`}>, </span>
        )
      )}
    </Fragment>
  );
}

function defaultRightHeader(type, setType, severity, setSeverity, entityType, setEntityType, enabled, setEnabled) {
  return (
    <Fragment>
      {createNewEntityButton({
        labelNew: 'New Event',
        pathNew: teamSettingsAlertingEventCustomNew,
        trackEvent: openEventSubmitFormTracker
      })}
      {inSelectListDialogRightHeader(
        type,
        setType,
        severity,
        setSeverity,
        entityType,
        setEntityType,
        enabled,
        setEnabled
      )}
    </Fragment>
  );
}

function inSelectListDialogRightHeader(
  type,
  setType,
  severity,
  setSeverity,
  entityType,
  setEntityType,
  enabled,
  setEnabled
) {
  return (
    <Fragment>
      <ComboBox
        name="filter-type"
        value={type}
        options={typeOptions}
        onChange={e => (e ? setType(e.value) : setType(null))}
        placeholder="Type…"
        className={locals.filterDropdown}
      />
      <ComboBox
        name="filter-severity"
        value={severity}
        options={severityOptions}
        onChange={e => (e ? setSeverity(e.value) : setSeverity(null))}
        placeholder="Incidents & Severity…"
        className={classNames(locals.severityDropdown, locals.filterDropdown)}
      />
      <ComboBox
        name="filter-entity-type"
        value={entityType}
        options={entityTypeOptions}
        onChange={e => (e ? setEntityType(e.value) : setEntityType(null))}
        placeholder="Entity Type…"
        className={classNames(locals.entityTypeDropdown, locals.filterDropdown)}
      />
      <ComboBox
        name="filter-enabled"
        value={enabled}
        options={enabledOptions}
        onChange={e => (e ? setEnabled(e.value) : setEnabled(null))}
        placeholder="State…"
        className={locals.stateDropdown}
      />
    </Fragment>
  );
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
