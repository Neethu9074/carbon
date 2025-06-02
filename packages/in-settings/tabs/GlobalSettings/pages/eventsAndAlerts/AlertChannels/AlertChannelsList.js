/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Link } from '@instana/components';

import { getEntityHref, getEntityIdView, globalSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { fullyQualified } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { clickAlertChannelTracker, alertChannelCTATrackerSegment } from 'in-settings/tracker';
import PropertyInTable from 'in-settings/tabs/GlobalSettings/components/PropertyInTable';
import TagsInTable from 'in-settings/tabs/GlobalSettings/components/TagsInTable';
import { SETTINGS_ALERT_CHANNEL_CLICK } from 'in-services/tracking/eventNames';
import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import WithSubscript from 'in-settings/components/WithSubscript';
import { rbacTeamsEnabled } from 'in-services/featureFlags';
import useUrlState from 'in-hooks/useUrlState';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './AlertChannelsList.mless';

/**
 * A searchable list of all configured alert channels that does not reveal confidential or pure configuration related
 * properties, but only information that helps to better understand what this alert channel is about.
 */
export default function AlertChannelsList({
  setTitle = true,
  tableActions = {},
  loadEntities,
  noDataMessage,
  renderNoDataAvailable,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = true,
  inSelectListDialog = false,
  detailView,
  alertChannels,
  alertChannelPerSeverityEnabled,
  getHeader = defaultGetHeader(inSelectListDialog, tableActions)
}) {
  const BOUNDED_PATH = '/channels';
  const { location } = useNavigation();
  const channelListColumnDefinitions =
    alertChannelPerSeverityEnabled && detailView
      ? [...columnDefinitions(hasRowNavigation), ...columnDefinitionsAlertLevel(alertChannels)]
      : columnDefinitions(hasRowNavigation);
  const [{ query }] = useUrlState({
    bind: [
      {
        path: BOUNDED_PATH,
        name: 'query',
        initialState: ''
      }
    ]
  });

  return (
    <List
      title={setTitle ? t('in-settings:tabs.alertChannels') : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={channelListColumnDefinitions}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getAlertChannelsInfosMutable}
      noDataMessage={noDataMessage}
      renderNoDataAvailable={renderNoDataAvailable}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['name', getKind, getStringifiedParameters, getStringifiedTags]}
      extraFilters={createFilters(hiddenIds)}
      onFilter={query.includes(':teams:') && (entities => createTeamsQueryFilter(entities, query))}
      searchPlaceholder={t('in-settings:tabs.filter')}
      onRowClick={onRowClick}
      boundedPath={BOUNDED_PATH}
      getDetailsHref={
        onRowClick || !hasRowNavigation
          ? null
          : entity => {
              clickAlertChannelTracker({
                alertChannelName: entity.name ?? '',
                alertChannelId: entity.id ?? '',
                alertChannelKind: entity.kind ?? ''
              });
              alertChannelCTATrackerSegment({
                EVENT_NAME: SETTINGS_ALERT_CHANNEL_CLICK,
                channel: entity.kind ?? '',
                path: location.pathname,
                additionalLabel: entity.id ?? ''
              });
              return getEntityHref(globalSettingsAlertingAlertChannels, entity.id);
            }
      }
    />
  );
}

export function columnDefinitions(hasRowNavigation) {
  const columns = [
    {
      id: 'name',
      label: t('in-settings:tabs.name'),
      width: 35,
      ellipsis: true,
      getContent(entity) {
        return (
          <WithSubscript subscript={getKind(entity)}>
            {hasRowNavigation ? (
              <Link href={getEntityIdView(globalSettingsAlertingAlertChannels, entity.id)} ellipsis>
                {entity.name}
              </Link>
            ) : (
              <span className={locals.ellipsis}>{entity.name}</span>
            )}
          </WithSubscript>
        );
      },
      getValue(entity) {
        return entity.name;
      }
    },
    {
      id: 'properties',
      label: t('in-settings:tabs.properties'),
      sortable: false,
      width: 35,
      getContent(entity) {
        if (!entity.properties) {
          return null;
        }
        return (
          <div className={locals.allProperties}>
            {Object.keys(entity.properties).map((property, index) => (
              <Tooltip
                key={property}
                content={`${property}: ${entity.properties[property]}`}
                align="auto"
                delay={500}
                overwriteBlock
                overflowEllipsis
              >
                <PropertyInTable label={property} value={entity.properties[property]} key={index} />
              </Tooltip>
            ))}
          </div>
        );
      }
    }
  ];
  if (rbacTeamsEnabled) {
    columns.push({
      id: 'teams',
      label: t('in-settings:tabs.teams.teamsTitle'),
      sortable: false,
      width: 30,
      getContent(entity) {
        if (!entity.rbacTags) {
          return null;
        }
        return (
          <div className={locals.allProperties}>
            <TagsInTable tags={entity.rbacTags} />
          </div>
        );
      }
    });
  }
  return columns;
}

function columnDefinitionsAlertLevel(alertChannels) {
  return [
    {
      id: 'alertLevel',
      label: t('in-alerting:smartAlerts.alertChannelList.alertLevel'),
      sortable: false,
      width: '8rem',
      widthInAbsoluteUnit: true,
      getContent(entity) {
        const hasWarning = checkChannelPresentIn('WARNING', alertChannels, entity.id);
        const hasCritical = checkChannelPresentIn('CRITICAL', alertChannels, entity.id);

        if (hasWarning && hasCritical) {
          return `${t('in-settings:tabs.warning')}, ${t('in-settings:tabs.critical')}`;
        }

        return hasCritical ? t('in-settings:tabs.critical') : t('in-settings:tabs.warning');
      }
    }
  ];
}

function checkChannelPresentIn(thresholdType, alertChannels, channelId) {
  return alertChannels[thresholdType]?.includes(channelId) ?? false;
}

function defaultGetHeader(inSelectListDialog, tableActions) {
  return leftHeaderWithSelectAll(t('in-settings:tabs.alertChannels'), inSelectListDialog, tableActions);
}

export function getEntityName(entity) {
  return t('in-settings:tabs.alertChannelEntityName', { entityName: entity.name });
}

function getConfig(entity) {
  return fullyQualified[entity.kind];
}

export function getKind(entity) {
  return get(getConfig(entity), ['label'], entity.kind);
}

function getParameters(entity) {
  const config = getConfig(entity);
  if (!config || !config.getParameters) {
    return null;
  }
  return config.getParameters();
}

function getStringifiedTags(entity) {
  const tags = entity.rbacTags;
  return tags && tags.length ? tags.map(item => item.displayName).join(',') : null;
}

export function getStringifiedParameters(entity) {
  const parameters = getParameters(entity);
  if (!parameters) {
    return null;
  }
  return parameters.reduce((acc, { key }) => {
    if (entity[key]) {
      return (acc += `,${entity[key]}`);
    }
    return acc;
  }, '');
}

export function noRightHeader() {
  // Used to explicitly disable that default right header (create new alert channel button) when this is used in a
  // dialog to select alert channels in the alert details form. Reason: The create-new button would navigate away from
  // the edit form in which's context the dialog is shown, thus the user would lose all their unsaved edits on that
  // form.
  return null;
}

export function createFilters(hiddenIds) {
  const filters = [];
  if (hiddenIds) {
    filters.push(entity => hiddenIds.indexOf(entity.id) < 0);
  }
  return filters;
}

// If the URL contains 'query=team:' we want to filter which teams are visible
// This filter is used in place of the default searching filter as long as the team query exists
// Otherwise we return false and then the default search filter is applied
export function createTeamsQueryFilter(entities, query) {
  if (query && query != '' && query.includes(':teams:')) {
    const team = query.includes(':') && query.split(':');
    const teamArr = (team && team[2] && team[2].split(',')) || [];
    const result = entities.filter(entity => {
      return handleTeamsFilter(entity, teamArr);
    });
    return result;
  }
  return false;
}

// Handler for teams filter
// If a team ends with a "!" we want to search on the exact naming
// If a team doesnt end with "!" we do a includes for partial patching
export function handleTeamsFilter(entity, filters) {
  // Generate the rbac tags for the entity
  const rbacTagsArr = [];
  entity.rbacTags.map(i => {
    rbacTagsArr.push(i.displayName.toLowerCase());
  });

  // Go through the team filters list
  return filters.every(element => {
    const lastChar = element.charAt(element.length - 1);
    // If the last character is a "!" we want exact matching
    if (lastChar == '!') {
      const newElement = element.substring(0, element.length - 1);
      return rbacTagsArr.includes(newElement.toLowerCase());
    } else {
      // else do partial includes for substrings
      return rbacTagsArr.some(string => string.includes(element.toLowerCase()));
    }
  });
}
