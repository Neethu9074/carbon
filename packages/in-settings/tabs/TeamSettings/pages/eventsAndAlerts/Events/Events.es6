import { withState, compose } from 'recompose';
import React, { Fragment } from 'react';

import { customEnumValue, builtInEnumValue, isBuiltInRule } from './util';
import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingEventBuiltIn,
  teamSettingsAlertingEventCustom,
  teamSettingsAlertingEventCustomNew
} from 'in-settings/navigation/paths';
import { getEventSpecificationsMutable, deleteCustomEventSpecification } from 'in-api/eventSpecifications';
import List, { createNewEntityButton } from 'in-settings/components/List';
import WithSubscript from 'in-settings/components/WithSubscript';
import { joinClassNames } from 'in-services/util/classnames';
import { setBuiltInRuleEnabledMutable } from 'in-api/rules';
import WithIcon from 'in-new-components/WithIcon';
import { getSingular } from 'in-sdk/pluginName';
import ComboBox from 'in-components/ComboBox';
import Badge from 'in-components/Badge';
import Link from 'in-components/Link';
import theme from 'in-themes';

import locals from './Events.mless';

const typeOptions = [{ value: builtInEnumValue, label: 'Built-in' }, { value: customEnumValue, label: 'Custom' }];

const arbitrarySeverityForIncidentsFilter = -13;
const severityOptions = [
  { value: arbitrarySeverityForIncidentsFilter, label: 'Incidents' },
  { value: 5, label: 'Warning' },
  { value: 10, label: 'Critical' }
];

export default compose(
  withState('type', 'setType', null),
  withState('severity', 'setSeverity', null)
)(Events);

function Events({
  type,
  setType,
  severity,
  setSeverity,
  setTitle = true,
  getHeader = defaultGetHeader,
  tableActions = defaultTableActions,
  loadEntities,
  noDataMessage,
  pageSize = 20,
  rightHeader = defaultRightHeader(type, setType, severity, setSeverity),
  isSearchable = true,
  hasRowNavigation = true
}) {
  return (
    <List
      title={setTitle ? 'Events' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getEventSpecificationsMutable}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['name', 'description', getEntityType]}
      extraFilters={createFilters(type, severity)}
      searchPlaceholder="Filter Events…"
      searchMaxWidth={196}
      getDetailsHref={hasRowNavigation ? entity => getEntityHref(getDetailsPath(entity), entity.id) : null}
    />
  );
}

function columnDefinitions(hasRowNavigation) {
  return [
    {
      id: 'name',
      label: 'Name',
      ellipsis: '20vw',
      getContent(entity) {
        const icon = getIcon(entity);
        return (
          <WithIcon icon={icon.icon} iconColor={icon.color}>
            <WithSubscript subscript={getSubscript(entity)}>
              {hasRowNavigation ? (
                <Link href$={getEntityIdView(getDetailsPath(entity), entity.id)}>
                  {entity.name} {entity.deprecated && <Badge size="sm">Deprecated Event</Badge>}
                </Link>
              ) : (
                <span>
                  {entity.name} {entity.deprecated && <Badge size="sm">Deprecated Event</Badge>}
                </span>
              )}
            </WithSubscript>
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
      ellipsis: '20vw',
      getContent(entity) {
        return entity.description;
      }
    },
    {
      id: 'entityType',
      label: 'Entity Type',
      ellipsis: '10vw',
      getContent(entity) {
        return <WithIcon plugin={entity.entityType}>{getSingular(entity.entityType)}</WithIcon>;
      },
      getValue: getEntityType
    }
  ];
}

const defaultTableActions = {
  toggleEnabled: {
    key: 'enabled',
    toggle: entity => {
      if (isBuiltInRule(entity)) {
        return setBuiltInRuleEnabledMutable(entity.id, !entity.enabled);
      }
    }
  },
  delete: {
    deleteEntity: entity => deleteCustomEventSpecification(entity.id),
    deleteProtection: entity => isBuiltInRule(entity)
  }
};

function defaultGetHeader(totalHits) {
  return totalHits ? `Events (${totalHits})` : 'Events';
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
    icon = 'lib_events_warning';
    color = theme.lib.colors.yellow800;
  } else if (entity.severity > 5) {
    icon = 'lib_events_critical';
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
  return getSingular(entity.entityType);
}

function getSubscript(entity) {
  if (isBuiltInRule(entity) && entity.enabled) {
    return 'Built-in';
  } else if (isBuiltInRule(entity)) {
    return 'Built-in, Disabled';
  } else if (entity.enabled === false) {
    return 'Disabled';
  }
  return null;
}

function defaultRightHeader(type, setType, severity, setSeverity) {
  return (
    <Fragment>
      {createNewEntityButton('New Event', teamSettingsAlertingEventCustomNew)}
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
        className={joinClassNames(locals.severityDropdown, locals.filterDropdown)}
      />
    </Fragment>
  );
}

function createFilters(type, severity) {
  const filters = [];

  if (type) {
    filters.push(entity => entity.type === type);
  }

  if (severity === arbitrarySeverityForIncidentsFilter) {
    filters.push(entity => entity.triggering);
  } else if (severity) {
    filters.push(entity => entity.severity === severity);
  }

  return filters;
}
