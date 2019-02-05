import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingMaintenanceConfigurations,
  teamSettingsAlertingMaintenanceConfigurationNew
} from 'in-settings/navigation/paths';
import { getMaintenanceConfigsMutable, deleteMaintenanceConfig } from 'in-api/maintenanceConfiguration';
import { formatDateTime } from 'in-services/formatters/date';
import { toTitleCase } from 'in-services/util/string';
import List from 'in-settings/components/List';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './MaintenanceConfigurations.mless';
import theme from 'in-themes';

export default function MaintenanceWindows() {
  const getStartAsString = getFormattedDateTimeFromFirstWindow.bind(null, 'start');
  const getEndAsString = getFormattedDateTimeFromFirstWindow.bind(null, 'end');
  return (
    <List
      title="Maintenance Window Configurations"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getMaintenanceConfigsMutable}
      initialOrderBy="name"
      labelNew="Schedule Maintenance Window"
      pathNew={teamSettingsAlertingMaintenanceConfigurationNew}
      searchAttributes={['name', 'query', getStartAsString, getEndAsString, 'status']}
      getDetailsHref={entity => getEntityHref(teamSettingsAlertingMaintenanceConfigurations, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(entity) {
      return (
        <Link href$={getEntityIdView(teamSettingsAlertingMaintenanceConfigurations, entity.id)}>
          <SvgIcon
            type="lib_actions_build_outline"
            width={24}
            height={24}
            className={locals.icon}
            color={theme.lib.colors.primary2}
          />
          {entity.name}
        </Link>
      );
    }
  },
  {
    id: 'query',
    label: 'Query',
    getContent(entity) {
      return entity.query;
    }
  },
  {
    id: 'starts',
    label: 'Starts',
    getContent(entity) {
      return getFormattedDateTimeFromFirstWindow('start', entity);
    }
  },
  {
    id: 'ends',
    label: 'Ends',
    getContent(entity) {
      return getFormattedDateTimeFromFirstWindow('end', entity);
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent(entity) {
      return toTitleCase(entity.status);
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteMaintenanceConfig(entity.id)
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

function getHeader(totalHits) {
  return totalHits ? `Maintenance Window Configurations (${totalHits})` : 'Maintenance Window Configurations';
}

function getEntityName(entity) {
  return `maintenance window configuration "${entity.name}"`;
}
