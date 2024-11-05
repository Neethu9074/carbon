/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { Link } from '@instana/components';

import {
  getEntityHref,
  getEntityIdView,
  globalSettingsAlertingMaintenanceConfigurations,
  globalSettingsAlertingMaintenanceConfigurationNew
} from 'in-settings/navigation/paths';
import {
  getMaintenanceConfigsMutable,
  deleteMaintenanceConfig
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/api';
import {
  SETTINGS_MAINTENANCE_WINDOW_EDIT,
  SETTINGS_MAINTENANCE_WINDOW_NEW,
  SETTINGS_MAINTENANCE_WINDOW_REMOVE
} from 'in-services/tracking/eventNames';
import { maintenanceWindowCTATracker } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/tracker';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { formatDateTime } from 'in-services/formatters/date';
import { toTitleCase } from 'in-services/util/string';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function MaintenanceWindows() {
  const getStartAsString = getFormattedDateTimeFromFirstWindow.bind(null, 'start');
  const getEndAsString = getFormattedDateTimeFromFirstWindow.bind(null, 'end');
  const { location } = useNavigation();
  return (
    <List
      title={t('in-settings:tabs.maintenanceWindowConfigurations')}
      getHeader={defaultHeaderWithCount(t('in-settings:tabs.maintenanceWindowConfigurations'))}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getMaintenanceConfigsMutable}
      initialOrderBy="name"
      labelNew={t('in-settings:tabs.scheduleMaintenanceWindow')}
      pathNew={globalSettingsAlertingMaintenanceConfigurationNew}
      trackEvent={() => maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_NEW, location?.pathname)}
      searchAttributes={['name', 'query', getStartAsString, getEndAsString, 'status']}
      getDetailsHref={entity => getEntityHref(globalSettingsAlertingMaintenanceConfigurations, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    getContent: function Content(entity) {
      return (
        <Tooltip content={entity.name} align="topLeft" delay={500}>
          <Link
            href={getEntityIdView(globalSettingsAlertingMaintenanceConfigurations, entity.id)}
            onClick={() => maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_EDIT, location.pathname)}
          >
            <WithIcon icon="lib_actions_build_outline" iconColor={themes.default.ids.color.option.blue['500']} ellipsis>
              {entity.name}
            </WithIcon>
          </Link>
        </Tooltip>
      );
    }
  },
  {
    id: 'query',
    label: t('in-settings:tabs.query'),
    ellipsis: true,
    getContent(entity) {
      return (
        <Tooltip content={entity.query} delay={500}>
          <span>{entity.query}</span>
        </Tooltip>
      );
    }
  },
  {
    id: 'starts',
    label: t('in-settings:tabs.startTime'),
    ellipsis: true,
    getValue(entity) {
      return getDateTimeFromFirstWindow('start', entity);
    },
    getContent(entity) {
      return getFormattedDateTimeFromFirstWindow('start', entity);
    }
  },
  {
    id: 'ends',
    label: t('in-settings:tabs.endTime'),
    ellipsis: true,
    getValue(entity) {
      return getDateTimeFromFirstWindow('end', entity);
    },
    getContent(entity) {
      return getFormattedDateTimeFromFirstWindow('end', entity);
    }
  },
  {
    id: 'status',
    label: t('in-settings:tabs.status'),
    ellipsis: true,
    getContent(entity) {
      return toTitleCase(entity.status);
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => {
      maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_REMOVE, location.pathname);
      return deleteMaintenanceConfig(entity.id);
    }
  }
};

function getFormattedDateTimeFromFirstWindow(key, entity) {
  if (entity.windows && entity.windows.length === 1) {
    return formatDateTime(entity.windows[0][key]);
  } else if (entity.windows && entity.windows.length > 1) {
    return 'multiple';
  } else {
    return null;
  }
}

function getDateTimeFromFirstWindow(key, entity) {
  if (entity.windows && entity.windows.length === 1) {
    return entity.windows[0][key];
  } else if (entity.windows && entity.windows.length > 1) {
    return 'multiple';
  } else {
    return null;
  }
}

function getEntityName(entity) {
  return t('in-settings:tabs.maintenanceWindowConfigurationEntityName', { entityName: entity.name });
}
