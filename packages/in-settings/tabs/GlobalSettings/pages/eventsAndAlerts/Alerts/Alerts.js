/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState } from 'react';
import { get } from 'lodash';

import { Link } from '@instana/components';

import {
  getEntityHref,
  getEntityIdView,
  globalSettingsAlertingAlertNew,
  globalSettingsAlertingAlerts
} from 'in-settings/navigation/paths';
import {
  SETTINGS_ALERT_OPEN_SUBMIT_FORM,
  SETTINGS_ALERT_TOGGLE,
  SETTINGS_ALERT_DELETE
} from 'in-services/tracking/eventNames';
import { parseQuery, scopeApplication, scopeDfq } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/shared';
import { deleteAlertingConfig, getAlertingConfigsMutable, setEnabled } from 'in-api/alertingConfiguration';
import List, { CreateNewEntityButton, defaultHeaderWithCount } from 'in-settings/components/List';
import PropertyInTable from 'in-settings/tabs/GlobalSettings/components/PropertyInTable';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import WithSubscript from 'in-settings/components/WithSubscript';
import { intersperse } from 'in-services/arrayUtils';
import ComboBox from 'in-components/ComboBox';
import Tooltip from 'in-components/Tooltip';
import config from 'in-services/config';
import { t } from 'in-i18n';

import locals from './Alerts.mless';

const maxNumOfAlertingAlerts = get(config, ['configuration', 'maxAllowedAlertingConfigurations'], 200);

const enabledOptions = Object.freeze([
  { value: true, label: t('in-settings:tabs.enabled') },
  { value: false, label: t('in-settings:tabs.disabled') }
]);

export default function Alerts() {
  const [enabled, setEnabled] = useState(null);
  //function for segment tracking
  const { trackCta } = useSegmentTracking();
  return (
    <List
      title={t('in-settings:tabs.alerts')}
      getHeader={defaultHeaderWithCount(t('in-settings:tabs.alerts'))}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions(trackCta)}
      loadEntities={getAlertingConfigsMutable}
      initialOrderBy="alertName"
      newButtonDisabledTooltipMessage={entities =>
        entities && entities.length >= maxNumOfAlertingAlerts
          ? t('in-settings:tabs.theNumberOfAlertsIsRestrictedToMaxNumOfAlertingAlerts', {
              maxNumOfAlertingAlerts: maxNumOfAlertingAlerts
            })
          : null
      }
      rightHeader={defaultRightHeader(enabled, setEnabled, trackCta)}
      searchAttributes={['alertName', renderTypesOrNumberOfEvents, scopeToString, concatChannelNames]}
      extraFilters={createFilters(enabled)}
      getDetailsHref={entity => getEntityHref(globalSettingsAlertingAlerts, entity.id)}
      trackEvent={() => trackCta(SETTINGS_ALERT_OPEN_SUBMIT_FORM)}
      noDataMessage={t('in-settings:tabs.noAlertConfigured')}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    width: 40,
    getContent(entity) {
      return (
        <WithSubscript subscript={getSubscript(entity)}>
          <Link href={getEntityIdView(globalSettingsAlertingAlerts, entity.id)} ellipsis>
            {entity.alertName}
          </Link>
        </WithSubscript>
      );
    }
  },
  {
    id: 'scope',
    label: t('in-settings:tabs.additionalScope'),
    ellipsis: true,
    getContent: renderScope,
    getValue: scopeToString
  },
  {
    id: 'channels',
    label: t('in-settings:tabs.alertChannels'),
    ellipsis: true,
    getContent(entity) {
      const allChannels = concatChannelNames(entity);
      return (
        <Tooltip content={allChannels} delay={500} overflowEllipsis>
          <span>{allChannels}</span>
        </Tooltip>
      );
    },
    getValue: concatChannelNames
  }
];

const tableActions = trackCta => {
  return {
    delete: {
      deleteEntity: entity => {
        trackCta(SETTINGS_ALERT_DELETE, {
          alertID: entity.id || ''
        });
        return deleteAlertingConfig(entity.id);
      }
    },
    toggleEnabled: {
      get: isEnabled,
      toggle: entity => {
        trackCta(SETTINGS_ALERT_TOGGLE, {
          alertName: entity.alertName,
          alertChannelNames: entity.alertChannelNames,
          numOfSelectedEvents: entity.eventFilteringConfiguration.ruleIds
            ? entity.eventFilteringConfiguration.ruleIds.length
            : 0
        });
        return setEnabled(entity, !isEnabled(entity));
      }
    }
  };
};

function defaultRightHeader(enabled, setEnabled, trackCta) {
  return (
    <Fragment>
      {
        <CreateNewEntityButton
          labelNew={t('in-settings:tabs.newAlert')}
          trackEvent={() => trackCta(SETTINGS_ALERT_OPEN_SUBMIT_FORM)}
          pathNew={globalSettingsAlertingAlertNew}
        />
      }
      <div className={locals.stateDropdown}>
        <ComboBox
          name="filter-state"
          value={enabled}
          options={enabledOptions}
          onChange={e => (e ? setEnabled(e.value) : setEnabled(null))}
          placeholder={t('in-settings:tabs.state')}
        />
      </div>
    </Fragment>
  );
}

function createFilters(enabled) {
  const filters = [];
  if (enabled != null) {
    if (enabled) {
      filters.push(entity => entity.muteUntil == null || entity.muteUntil < Date.now());
    } else {
      filters.push(entity => entity.muteUntil > Date.now());
    }
  }
  return filters;
}

function isEnabled(entity) {
  return entity.muteUntil == null || entity.muteUntil < Date.now();
}

function getEntityName(entity) {
  return `alert "${entity.alertName}"`;
}

function getSubscript(entity) {
  const typesOrNumberOfEvents = renderTypesOrNumberOfEvents(entity);
  return (
    <Fragment>
      {intersperse(
        [
          !isEnabled(entity) ? <span key="disabled">{t('in-settings:tabs.disabled')}</span> : null,
          typesOrNumberOfEvents ? <span key="events">{renderTypesOrNumberOfEvents(entity)}</span> : null,
          entity.invalid ? (
            <span key="invalid" className={locals.invalid}>
              {t('in-settings:tabs.invalidQuery')}
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

function renderTypesOrNumberOfEvents(entity) {
  if (
    entity.eventFilteringConfiguration &&
    entity.eventFilteringConfiguration.eventTypes &&
    entity.eventFilteringConfiguration.eventTypes.length > 0
  ) {
    return renderTypes(entity.eventFilteringConfiguration.eventTypes);
  } else if (
    entity.eventFilteringConfiguration &&
    entity.eventFilteringConfiguration.ruleIds &&
    entity.eventFilteringConfiguration.ruleIds.length > 0
  ) {
    return renderNumberOfSelectedEvents(entity.eventFilteringConfiguration.ruleIds);
  }
  return '';
}

function renderTypes(eventTypes) {
  if (eventTypes.length === 1 && eventTypes[0]) {
    return t('in-settings:tabs.allEventType', { eventType: renderType(eventTypes[0]) });
  }
  if (eventTypes.length >= 4) {
    return t('in-settings:tabs.variousEventTypes');
  } else {
    return eventTypes.map(renderType).join(', ');
  }
}

function renderType(type) {
  switch (type) {
    case 'incident':
      return t('in-settings:tabs.incidents');
    case 'critical':
      return t('in-settings:tabs.criticalEvents');
    case 'warning':
      return t('in-settings:tabs.warnings');
    case 'change':
      return t('in-settings:tabs.changes');
    case 'online':
      return t('in-settings:tabs.onlineEvents');
    case 'offline':
      return t('in-settings:tabs.offlineEvents');
    case 'agent_monitoring_issue':
      return t('in-settings:tabs.monitoringIssues');
    default:
      return '?';
  }
}

function renderNumberOfSelectedEvents(eventIds) {
  return eventIds.length === 1 ? 'One Selected Event' : `Selected Events (${eventIds.length})`;
}

function renderScope(entity) {
  if (!entity.eventFilteringConfiguration || !entity.eventFilteringConfiguration.query) {
    return '';
  }
  const { applyOn } = parseQuery(entity.eventFilteringConfiguration.query);
  if (applyOn === scopeDfq) {
    return (
      <Tooltip content={entity.eventFilteringConfiguration.query} delay={500}>
        <PropertyInTable label={t('in-settings:tabs.filterQuery')} value={entity.eventFilteringConfiguration.query} />
      </Tooltip>
    );
  } else if (applyOn === scopeApplication) {
    const applications = concatApplicationNames(entity);
    return (
      <Tooltip content={applications} delay={500}>
        <PropertyInTable label={getApplicationLabel(entity)} value={applications} />
      </Tooltip>
    );
  } else {
    return '';
  }
}

function scopeToString(entity) {
  if (!entity.eventFilteringConfiguration || !entity.eventFilteringConfiguration.query) {
    return '';
  }
  const { applyOn } = parseQuery(entity.eventFilteringConfiguration.query);
  if (applyOn === scopeDfq) {
    return entity.eventFilteringConfiguration.query;
  } else if (applyOn === scopeApplication) {
    return entity.eventFilteringConfiguration.query;
  } else {
    return '';
  }
}

function getApplicationLabel(entity) {
  return entity.applicationNames.length === 1 ? 'APPLICATION' : `APPLICATIONS (${entity.applicationNames.length})`;
}

function concatChannelNames(entity) {
  return entity.alertChannelNames ? entity.alertChannelNames.join(', ') : '';
}

function concatApplicationNames(entity) {
  return entity.applicationNames ? entity.applicationNames.join(', ') : '';
}
