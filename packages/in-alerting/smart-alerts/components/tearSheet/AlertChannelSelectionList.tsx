/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';
import { get } from 'lodash';

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

// @ts-ignore - Need migration : Using modules without declaration files
import { fullyQualified } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
// @ts-ignore - Need migration : Using modules without declaration files
import PropertyInTable from 'in-settings/tabs/GlobalSettings/components/PropertyInTable';
// @ts-ignore - Need migration : Using modules without declaration files
import TagsInTable from 'in-settings/tabs/GlobalSettings/components/TagsInTable';
import { getEntityIdView, globalSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import ListDataTable from 'in-alerting/smart-alerts/components/ListTable/ListTable';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useIsTeamsAvailable from 'in-settings/hooks/useIsTeamsAvailable';
import WithSubscript from 'in-components/WithSubscript/WithSubscript';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import { pageSizes } from 'in-alerting/smart-alerts/data/constants';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/AlertChannelSelectionList.mless';

interface TeamTag {
  id: string;
  displayName: string;
  [key: string]: any;
}

export interface AlertChannel {
  id: string;
  name: string;
  kind: string;
  properties?: Record<string, string>;
  rbacTags?: TeamTag[];
  [key: string]: any;
}

interface AlertChannelSelectionListProps {
  setTitle?: boolean;
  tableActions?: Record<string, any>;
  loadEntities?: () => Observable<AlertChannel[] | null>;
  hiddenIds?: string[];
  selectedItems?: string[];
  setSelectedItems?: React.Dispatch<React.SetStateAction<string[]>>;
  pageSize?: number;
  rightHeader?: React.ReactNode;
  isSearchable?: boolean;
  isSelectable?: boolean;
  hasRowNavigation?: boolean;
  isSelectedList?: boolean;
  noDataDescription?: string;
  detailView?: any;
  alertChannels?: Record<string, string[]>;
  alertChannelPerSeverityEnabled?: boolean;
  createdChannelId?: string;
}

/**
 * A searchable list of all configured alert channels that does not reveal confidential or pure configuration related
 * properties, but only information that helps to better understand what this alert channel is about.
 */
export default function AlertChannelSelectionList({
  setTitle = true,
  tableActions = {},
  loadEntities,
  hiddenIds,
  selectedItems = [],
  setSelectedItems,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  isSelectable = false,
  hasRowNavigation = true,
  isSelectedList = false,
  noDataDescription = t('in-alerting:components.noChannelCreateMessage'),
  detailView,
  alertChannels,
  alertChannelPerSeverityEnabled,
  createdChannelId
}: AlertChannelSelectionListProps) {
  const [isRbacTeamsAvailable] = useIsTeamsAvailable();
  const [tableKey, setTableKey] = useState(0);
  const { createHrefToPath } = useNavigation();
  const channelListColumnDefinitions =
    alertChannelPerSeverityEnabled && detailView
      ? [
          ...columnDefinitions(hasRowNavigation, createHrefToPath, Boolean(isRbacTeamsAvailable)),
          ...columnDefinitionsAlertLevel(alertChannels)
        ]
      : columnDefinitions(hasRowNavigation, createHrefToPath, Boolean(isRbacTeamsAvailable));

  // Force table re-render by updating tableKey when createdChannelId changes
  useEffect(() => {
    if (createdChannelId) {
      setTableKey(prevKey => prevKey + 1); // Force table re-render
    }
  }, [createdChannelId]);

  const entities = useObservable(() => {
    if (!loadEntities) return getAlertChannelsInfosMutable();
    else return;
  }, [createdChannelId]); // Re-fetch when createdChannelId changes

  const fromLoadEntities = useObservable(() => {
    if (loadEntities && !isSelectedList) return loadEntities();
    else return;
  }, []);

  const filterHidden = (listItems: AlertChannel[] | null | undefined): AlertChannel[] | null => {
    if (!listItems) return null;
    if (hiddenIds && hiddenIds.length > 0) {
      return listItems.filter(entity => !hiddenIds.includes(entity.id));
    }
    return listItems;
  };

  const resultEntities = filterHidden(entities as AlertChannel[] | null | undefined);
  const resultFromLoadEntities = filterHidden(fromLoadEntities as AlertChannel[] | null | undefined);

  // Decide which loadEntities function to use
  const resolvedLoadEntities = (): Observable<AlertChannel[] | null> => {
    if (loadEntities) {
      return resultFromLoadEntities ? just(resultFromLoadEntities) : loadEntities();
    }
    return just(resultEntities || null);
  };

  return (
    <ListDataTable
      key={tableKey} // Add key to force re-render when createdChannelId changes
      title={setTitle ? t('in-settings:tabs.alertChannels') : null}
      columnDefinitions={channelListColumnDefinitions}
      tableActions={tableActions}
      customSortEntities={createdChannelId ? sortSelecteditems([createdChannelId]) : undefined}
      loadEntities={resolvedLoadEntities}
      listPageSize={pageSize}
      pageSizes={pageSizes}
      isSearchable={isSearchable}
      isSelectable={isSelectable}
      searchPlaceholder={t('in-settings:tabs.filter')}
      noDataHeader={t('in-alerting:components.noChannelAvailable')}
      noDataDescription={noDataDescription}
      initialOrderBy="name"
      toolBarContent={rightHeader}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
    />
  );
}

// removed 'createHrefToPath', which was initialised within the GetContent, because UI was crashing with an error while searching: : Rendered more hooks than during the previous render.
export function columnDefinitions(
  hasRowNavigation: boolean,
  createHrefToPath: (path: string) => string,
  isRbacTeamsAvailable: boolean
) {
  const columns = [
    {
      id: 'name',
      label: t('in-settings:tabs.name'),
      width: 35,
      ellipsis: true,
      sortable: true,
      getContent: (entity: AlertChannel) => {
        return (
          <WithSubscript subscript={getKind(entity)}>
            {hasRowNavigation ? (
              <Link href={getEntityIdView(globalSettingsAlertingAlertChannels, entity.id, createHrefToPath)} ellipsis>
                {entity.name}
              </Link>
            ) : (
              <span className={locals.ellipsis}>{entity.name}</span>
            )}
          </WithSubscript>
        );
      },
      getValue(entity: AlertChannel) {
        return entity.name;
      }
    },
    {
      id: 'properties',
      label: t('in-settings:tabs.properties'),
      sortable: false,
      width: 35,
      getContent(entity: AlertChannel) {
        if (!entity.properties) {
          return null;
        }
        return (
          <div className={locals.allProperties}>
            {Object.keys(entity.properties).map((property, index) => (
              <Tooltip
                key={property}
                content={`${property}: ${entity.properties![property]}`}
                align="auto"
                delay={500}
                overwriteBlock
                overflowEllipsis
              >
                <PropertyInTable label={property} value={entity.properties![property]} key={index} />
              </Tooltip>
            ))}
          </div>
        );
      }
    }
  ];
  if (isRbacTeamsAvailable) {
    columns.push({
      id: 'teams',
      label: t('in-settings:tabs.teams.teamsTitle'),
      sortable: false,
      width: 30,
      getContent(entity: AlertChannel) {
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

function columnDefinitionsAlertLevel(alertChannels?: Record<string, string[]>) {
  return [
    {
      id: 'alertLevel',
      label: t('in-alerting:smartAlerts.alertChannelList.alertLevel'),
      sortable: false,
      width: '8rem',
      widthInAbsoluteUnit: true,
      getContent(entity: AlertChannel) {
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

function sortSelecteditems(selectedIds: string[]) {
  return ({ entities }: { entities: AlertChannel[] }) => {
    return entities.sort((a, b) => selectedIds.indexOf(b.id) - selectedIds.indexOf(a.id));
  };
}

function checkChannelPresentIn(thresholdType: string, alertChannels?: Record<string, string[]>, channelId?: string) {
  return alertChannels?.[thresholdType]?.includes(channelId || '') ?? false;
}

export function getEntityName(entity: AlertChannel) {
  return t('in-settings:tabs.alertChannelEntityName', { entityName: entity.name });
}

function getConfig(entity: AlertChannel) {
  return fullyQualified[entity.kind];
}

export function getKind(entity: AlertChannel) {
  return get(getConfig(entity), ['label'], entity.kind);
}

function getParameters(entity: AlertChannel) {
  const config = getConfig(entity);
  if (!config || !config.getParameters) {
    return null;
  }
  return config.getParameters();
}

export function getStringifiedParameters(entity: AlertChannel) {
  const parameters = getParameters(entity);
  if (!parameters) {
    return null;
  }
  return parameters.reduce((acc: string, { key }: { key: string }) => {
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

export function createFilters(hiddenIds?: string[]) {
  const filters: Array<(entity: AlertChannel) => boolean> = [];
  if (hiddenIds) {
    filters.push(entity => hiddenIds.indexOf(entity.id) < 0);
  }
  return filters;
}

// If the URL contains 'query=team:' we want to filter which teams are visible
// This filter is used in place of the default searching filter as long as the team query exists
// Otherwise we return false and then the default search filter is applied
export function createTeamsQueryFilter(entities: AlertChannel[], query?: string) {
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
export function handleTeamsFilter(entity: AlertChannel, filters: string[]) {
  // Generate the rbac tags for the entity
  const rbacTagsArr: string[] = [];
  entity.rbacTags?.map(i => {
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

// Made with Bob
