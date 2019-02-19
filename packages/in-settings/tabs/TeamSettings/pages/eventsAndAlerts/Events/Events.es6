import { withState, compose } from 'recompose';
import React, { Fragment } from 'react';

import { customEnumValue, builtInEnumValue, builtInValue, customValue, isBuiltInRule } from './util';
import {
  events,
  getEntityHref,
  teamSettingsAlertingEvents,
  teamSettingsAlertingEventNew
} from 'in-settings/navigation/paths';
import { getEventSpecificationsMutable } from 'in-api/eventSpecifications';
import List, { createNewEntityButton } from 'in-settings/components/List';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import WithSubscript from 'in-settings/components/WithSubscript';
import { joinClassNames } from 'in-services/util/classnames';
import { setBuiltInRuleEnabledMutable } from 'in-api/rules';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { eventType } from 'in-settings/navigation/matrix';
import WithIcon from 'in-new-components/WithIcon';
import { getSingular } from 'in-sdk/pluginName';
import ComboBox from 'in-components/ComboBox';
import { deleteRule } from 'in-api/rules';
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

function Events({ type, setType, severity, setSeverity }) {
  return (
    <List
      title="Events"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getEventSpecificationsMutable}
      initialOrderBy="name"
      rightHeader={rightHeader(type, setType, severity, setSeverity)}
      searchAttributes={['name', 'description', getEntityType]}
      extraFilters={createFilters(type, severity)}
      searchPlaceholder="Filter Events…"
      searchMaxWidth={196}
      getDetailsHref={entity => getDetailsHref(entity)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    ellipsis: '20vw',
    getContent(entity) {
      const icon = getIcon(entity);
      return (
        <WithIcon icon={icon.icon} iconColor={icon.color}>
          <WithSubscript subscript={getSubscript(entity)}>
            <Link href$={getDetailsView(entity)}>
              {entity.name} {entity.deprecated && <Badge size="sm">Deprecated Event</Badge>}
            </Link>
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
    getContent(entity) {
      return <WithIcon plugin={entity.entityType}>{getSingular(entity.entityType)}</WithIcon>;
    },
    getValue: getEntityType
  }
];

const tableActions = {
  toggleEnabled: {
    key: 'enabled',
    toggle: entity => {
      if (isBuiltInRule(entity)) {
        return setBuiltInRuleEnabledMutable(entity.id, !entity.enabled);
      }
    }
  },
  delete: {
    deleteProtection: entity => isBuiltInRule(entity), // TODO Tooltip - why is this disabled?
    deleteEntity: entity => {
      if (!isBuiltInRule(entity)) {
        deleteRule(entity.id);
      }
    }
  }
};

function getHeader(totalHits) {
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

function getDetailsView(entity) {
  return getModifiedUrlStream(params => {
    params.pathname = getEntityHref(teamSettingsAlertingEvents, entity.id);
    setOrDeleteMatrixKey(params, events, eventType, getMatrixValue(entity));
  });
}

function getDetailsHref(entity) {
  if (entity.id) {
    return `${teamSettingsAlertingEvents};type=${getMatrixValue(entity)}/${encodeURIComponent(entity.id)}`;
  }
  return teamSettingsAlertingEvents;
}

function getMatrixValue(entity) {
  return isBuiltInRule(entity) ? builtInValue : customValue;
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

function rightHeader(type, setType, severity, setSeverity) {
  return (
    <Fragment>
      {createNewEntityButton('New Event', teamSettingsAlertingEventNew)}
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
