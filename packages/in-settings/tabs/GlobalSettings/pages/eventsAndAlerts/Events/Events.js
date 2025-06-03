/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { Spacer, Message } from '@instana/components';
import { Link, Stack } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  builtInEnumValue,
  customEnumValue,
  deprecatedValue,
  getEntityTypeOptionsOfBuiltInMetrics,
  getSeverityText,
  isDeprecatedAppDataEntityType,
  isBuiltInRule,
  migratedValue,
  needsMigrationAction
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/util';
import {
  MessageContentModernDesign,
  smartAlertMigrationUrl,
  onLinkClickForSegmentTracking
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import {
  getEntityHref,
  getEntityIdView,
  globalSettingsAlertingEventBuiltIn,
  globalSettingsAlertingEventCustom,
  globalSettingsAlertingEventCustomNew
} from 'in-settings/navigation/paths';
import {
  deleteCustomEventSpecification,
  getEventSpecificationsMutable,
  setBuiltInEventSpecificationsEnabled,
  setCustomEventSpecificationsEnabled
} from 'in-api/eventSpecifications';
import {
  SETTINGS_EVENT_OPEN_SUBMIT_FORM,
  SETTINGS_EVENT_DISABLE,
  SETTINGS_EVENT_ENABLE,
  SETTINGS_EVENT_DELETED,
  SETTINGS_EVENT_VIEW
} from 'in-services/tracking/tracking';
import { getPluginsWithCustomMetricsOptionsObservable } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customMetricUtils';
import { deprecateAppDataLegacyEventsEnabled, hideAppDataLegacyEventsEnabled } from 'in-services/featureFlags';
import getLegacyAlertConfigStats from 'in-alerting/smart-alerts/subscriptions/getLegacyAlertConfigStats';
import List, { CreateNewEntityButton, leftHeaderWithSelectAll } from 'in-settings/components/List';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { pageSizes } from 'in-alerting/smart-alerts/data/constants';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import WithSubscript from 'in-settings/components/WithSubscript';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import { intersperse } from 'in-services/arrayUtils';
import { getPluginName } from 'in-sdk/pluginName';
import useUrlState from 'in-hooks/useUrlState';
import ComboBox from 'in-components/ComboBox';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import { t, Trans } from 'in-i18n';

import locals from './Events.mless';

let typeOptions = [
  { value: builtInEnumValue, label: t('in-settings:tabs.builtIn') },
  { value: customEnumValue, label: t('in-settings:tabs.custom') }
];

const arbitrarySeverityForIncidentsFilter = -13;
const severityOptions = [
  { value: arbitrarySeverityForIncidentsFilter, label: t('in-settings:tabs.incidents') },
  { value: 5, label: t('in-settings:tabs.warning') },
  { value: 10, label: t('in-settings:tabs.critical') }
];

const entityTypeOptionsOfBuiltInMetrics = getEntityTypeOptionsOfBuiltInMetrics(false);

const enabledOptions = Object.freeze([
  { value: true, label: t('in-settings:tabs.enabled') },
  { value: false, label: t('in-settings:tabs.disabled') }
]);

const path = '/events';

const urlStateBinding = {
  bind: [
    { path, name: 'enabled', initialState: null, parser: strictBooleanParser },
    { path, name: 'entityType', initialState: null },
    { path, name: 'severity', initialState: null, parser: intParser },
    { path, name: 'type', initialState: null }
  ]
};

export default function Events({
  setTitle = true,
  tableActions = undefined,
  loadEntities,
  noDataMessage,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = true,
  inSelectListDialog = false,
  getHeader = undefined,
  /**
   * 1. Removes filter items for deprecated/migrated events
   * 2. Filters out deprecated/migrated events
   */
  withoutAppDataLegacyEvents
}) {
  const [{ enabled, entityType, severity, type }, setState] = useUrlState(urlStateBinding);
  const legacyAlertConfigStats = useObservable(getLegacyAlertConfigStats, []) ?? pendingResult;

  const setType = type => setState({ type });
  const setSeverity = severity => setState({ severity });
  const setEntityType = entityType => setState({ entityType });
  const setEnabled = enabled => setState({ enabled });

  const entityTypeOptionsOfCustomMetrics = useObservable(getPluginsWithCustomMetricsOptionsObservable, []);
  const allEntityTypeOptions = filterEntityTypeOptions(
    withoutAppDataLegacyEvents,
    combineAndSortByLabel(entityTypeOptionsOfBuiltInMetrics, entityTypeOptionsOfCustomMetrics)
  );

  const loadEvents = useLoadEventsFunction(withoutAppDataLegacyEvents, loadEntities);
  adjustTypeOptions(withoutAppDataLegacyEvents);
  const { trackCta } = useSegmentTracking();

  const tableDefaultActions = tableActions ?? getDefaultTableActions(trackCta);
  const header = getHeader ?? defaultGetHeader(inSelectListDialog, tableDefaultActions);

  return (
    <>
      {legacyAlertConfigStats.data?.deprecatedCustomEvents > 0 && <CustomEventDeprecatedWarning />}
      <List
        title={setTitle ? t('in-settings:tabs.events') : null}
        getHeader={header}
        getEntityName={getEntityName}
        columnDefinitions={columnDefinitions(hasRowNavigation)}
        tableActions={tableDefaultActions}
        loadEntities={loadEvents}
        noDataMessage={noDataMessage}
        pageSize={pageSize}
        initialOrderBy="name"
        rightHeader={getRightHeader(trackCta)}
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
        pageSizes={pageSizes}
      />
    </>
  );

  function getRightHeader(trackCta) {
    return !inSelectListDialog ? rightHeader ?? defaultRightHeader(trackCta) : inSelectListDialogRightHeader();
  }

  function defaultRightHeader(trackCta) {
    return (
      <Fragment>
        {
          <CreateNewEntityButton
            labelNew={t('in-settings:tabs.newEvent')}
            trackEvent={() => trackCta(SETTINGS_EVENT_OPEN_SUBMIT_FORM)}
            pathNew={globalSettingsAlertingEventCustomNew}
          />
        }
        {inSelectListDialogRightHeader()}
      </Fragment>
    );
  }

  function inSelectListDialogRightHeader() {
    return (
      <div className={locals.filterDropdown}>
        <Stack direction="horizontal" gap="xsmall">
          <ComboBox
            name="filter-type"
            value={type}
            options={typeOptions}
            onChange={e => (e ? setType(e.value) : setType(null))}
            placeholder={t('in-settings:tabs.type')}
          />
          <ComboBox
            name="filter-severity"
            value={severity}
            options={severityOptions}
            onChange={e => (e ? setSeverity(e.value) : setSeverity(null))}
            placeholder={t('in-settings:tabs.incidentsSeverity')}
            className={classNames(locals.severityDropdown)}
          />
          <ComboBox
            name="filter-entity-type"
            value={entityType}
            options={allEntityTypeOptions}
            onChange={e => (e ? setEntityType(e.value) : setEntityType(null))}
            placeholder={t('in-settings:tabs.entityType')}
            className={classNames(locals.entityTypeDropdown)}
          />
          <ComboBox
            name="filter-enabled"
            value={enabled}
            options={enabledOptions}
            onChange={e => (e ? setEnabled(e.value) : setEnabled(null))}
            placeholder={t('in-settings:tabs.state')}
            className={locals.stateDropdown}
          />
        </Stack>
      </div>
    );
  }
}

function CustomEventDeprecatedWarning() {
  const { trackCta } = useSegmentTracking();
  const smartAlertMigrationDocs = (
    <Link href={smartAlertMigrationUrl} onClick={() => onLinkClickForSegmentTracking(trackCta)} external>
      &nbsp;
    </Link>
  );
  return (
    <Message type="warning" withIcon fullInlineWidth>
      <MessageContentModernDesign>
        <Trans
          i18nKey="in-settings:tabs.customEventListDeprecatedWarning"
          components={{
            documentationLink: smartAlertMigrationDocs
          }}
        />
      </MessageContentModernDesign>
    </Message>
  );
}

function combineAndSortByLabel(array1, array2) {
  return array2 && array2.length > 0
    ? array1
        .concat(array2)
        .sort((a, b) => compareIgnoreCase(a.label, b.label))
        // remove duplicates from sorted array
        .filter(function (item, pos, array) {
          return !pos || compareIgnoreCase(item.label, array[pos - 1].label) !== 0;
        })
    : array1;
}

export function EventName({ entity, hasRowNavigation }) {
  const { trackCta } = useSegmentTracking();
  const { name } = entity;
  const icon = getIcon(entity, themes);

  const tooltipContent = needsMigrationAction(entity) ? (
    <>
      {name}
      <Spacer vertical="normal" />
      {t('in-settings:tabs.actionNeededRecommendMigrate')}
    </>
  ) : (
    name
  );
  return (
    <WithIcon icon={icon.icon} iconColor={icon.color}>
      <WithSubscript subscript={<Subscript entity={entity} />}>
        {hasRowNavigation ? (
          <Link
            href={getEntityIdView(getDetailsPath(entity), entity.id)}
            ellipsis
            onClick={() =>
              trackCta(SETTINGS_EVENT_VIEW, {
                eventDefinitionType: entity.type,
                entityType: entity.entityType,
                type: entity.triggering ? 'Incident' : 'None',
                severity: getSeverityText(entity.severity)
              })
            }
          >
            {name}
          </Link>
        ) : (
          <Tooltip content={tooltipContent} align="mousePosition" delay={500}>
            <span className={locals.ellipsis}>{name}</span>
          </Tooltip>
        )}
      </WithSubscript>
    </WithIcon>
  );
}

export function EntityType({ entity }) {
  if (entity.entityType === 'any') {
    return '';
  }
  return (
    <Tooltip content={getPluginName(entity.entityType, 1)} align="topLeft" delay={500}>
      <WithIcon plugin={entity.entityType} iconColor={themes.default.ids.color.option.neutral['700']}>
        {getPluginName(entity.entityType, 1)}
      </WithIcon>
    </Tooltip>
  );
}

function columnDefinitions(hasRowNavigation) {
  return [
    {
      id: 'name',
      label: t('in-settings:tabs.name'),
      width: 40,
      getContent(entity) {
        return <EventName entity={entity} hasRowNavigation={hasRowNavigation} />;
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
        return <EntityType entity={entity} />;
      },
      getValue: getEntityType
    }
  ];
}

function getDefaultTableActions(trackCta) {
  return {
    toggleEnabled: {
      get: isEnabled,
      disabled: entity => entity.migrated,
      toggle: entity => {
        if (entity.enabled) {
          trackCta(SETTINGS_EVENT_DISABLE, { ...entity });
        } else {
          trackCta(SETTINGS_EVENT_ENABLE, { ...entity });
        }
        if (isBuiltInRule(entity)) {
          return setBuiltInEventSpecificationsEnabled(entity.id, !entity.enabled);
        } else {
          return setCustomEventSpecificationsEnabled(entity.id, !entity.enabled);
        }
      }
    },
    delete: {
      deleteEntity: entity => {
        const deletion$ = deleteCustomEventSpecification(entity.id);
        deletion$.once(() => trackCta(SETTINGS_EVENT_DELETED, { ...entity }));
        return deletion$;
      },
      deleteProtection: entity => isBuiltInRule(entity)
    }
  };
}

function isEnabled(entity) {
  return entity.enabled;
}

function defaultGetHeader(inSelectListDialog, tableActions) {
  return leftHeaderWithSelectAll(t('in-settings:tabs.events'), inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return `event ${entity.name}`;
}

function getIcon(entity, themes) {
  if (entity.enabled === false) {
    return { icon: 'lib_actions_pause', color: themes.default.ids.color.option.neutral['400'] };
  }

  let icon = 'lib_events_change';
  let color = themes.default.ids.color.option.neutral['400'];
  if (entity.severity >= 1 && entity.severity <= 5) {
    icon = 'lib_events_warning';
    color = themes.default.ids.color.option.yellow['500'];
  } else if (entity.severity > 5) {
    icon = 'lib_events_critical';
    color = themes.default.ids.color.option.red['500'];
  }
  if (entity.triggering) {
    icon = 'lib_events_incident';
  }

  return { icon, color };
}

function getDetailsPath(entity) {
  return isBuiltInRule(entity) ? globalSettingsAlertingEventBuiltIn : globalSettingsAlertingEventCustom;
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
        [showBuiltIn(), showDisabled(), showInvalid(), showDeprecated(), showMigrated()].filter(elem => elem),
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
    return deprecateAppDataLegacyEventsEnabled &&
      !isBuiltInRule(entity) &&
      isDeprecatedAppDataEntityType(entity.entityType) ? (
      <span key="deprecated" className={locals.deprecated}>
        {t('in-settings:tabs.deprecated')}
      </span>
    ) : null;
  }

  function showMigrated() {
    return entity.migrated ? (
      <span key="invalid" className={locals.migrated}>
        {t('in-settings:tabs.migrated')}
      </span>
    ) : null;
  }
}

function createFilters(hiddenIds, type, severity, entityType, enabled) {
  const filters = [];

  if (hiddenIds) {
    filters.push(entity => hiddenIds.indexOf(entity.id) < 0);
  }

  if (type === migratedValue) {
    filters.push(entity => Boolean(entity.migrated));
  } else if (type === deprecatedValue) {
    filters.push(
      entity => !isBuiltInRule(entity) && isDeprecatedAppDataEntityType(entity.entityType) && !entity.migrated
    );
  } else if (type) {
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

function useLoadEventsFunction(withoutAppDataLegacyEvents, loadEntities) {
  const loadEventsFunc = loadEntities ? loadEntities : getEventSpecificationsMutable;

  if (hideAppDataLegacyEventsEnabled || withoutAppDataLegacyEvents) {
    return () =>
      loadEventsFunc().map(es => {
        return es.filter(({ entityType }) => !isDeprecatedAppDataEntityType(entityType));
      });
  }

  return loadEventsFunc;
}

function adjustTypeOptions(withoutAppDataLegacyEvents) {
  if (hideAppDataLegacyEventsEnabled || withoutAppDataLegacyEvents) {
    typeOptions = typeOptions.filter(({ value }) => [builtInEnumValue, customEnumValue].includes(value));
  } else {
    if (!typeOptions.some(({ value }) => value === deprecatedValue)) {
      typeOptions.push(
        { value: deprecatedValue, label: t('in-settings:tabs.deprecated') },
        { value: migratedValue, label: t('in-settings:tabs.migrated') }
      );
    }
  }
}

function filterEntityTypeOptions(withoutAppDataLegacyEvents, options) {
  if (hideAppDataLegacyEventsEnabled || withoutAppDataLegacyEvents) {
    return options.filter(({ value }) => !['application', 'service', 'endpoint'].includes(value));
  }
  return options;
}

function strictBooleanParser(str) {
  if (str === 'false') return false;
  if (str === 'true') return true;
  return null;
}
