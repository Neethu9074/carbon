import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingEventFilterNew,
  teamSettingsAlertingEventFilters
} from 'in-settings/navigation/paths';
import { deleteAlertingConfig, getAlertingConfigsMutable, setEnabled } from 'in-api/alertingConfiguration';
import WithSubscript from 'in-settings/components/WithSubscript';
import { intersperse } from 'in-services/arrayUtils';
import List from 'in-settings/components/List';
import config from 'in-services/config';
import Link from 'in-components/Link';

import locals from './EventFilters.mless';

const maxNumOfAlertingEventFilters = get(config, ['configuration', 'maxAllowedAlertingConfigurations'], 50);

export default function EventFilters() {
  return (
    <List
      title="Alerts"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getAlertingConfigsMutable}
      initialOrderBy="alertName"
      labelNew="New Alert"
      pathNew={teamSettingsAlertingEventFilterNew}
      newButtonDisabledTooltipMessage={entities =>
        entities && entities.length >= maxNumOfAlertingEventFilters
          ? `The number of alerts is restricted to ${maxNumOfAlertingEventFilters}.`
          : null
      }
      searchAttributes={['alertName']}
      getDetailsHref={entity => getEntityHref(teamSettingsAlertingEventFilters, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(entity) {
      return (
        <WithSubscript subscript={getSubscript(entity)}>
          <Link href$={getEntityIdView(teamSettingsAlertingEventFilters, entity.id)} className={locals.ellipsis50vw}>
            {entity.alertName}
          </Link>
        </WithSubscript>
      );
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteAlertingConfig(entity.id)
  },
  toggleEnabled: {
    get: isEnabled,
    toggle: entity => {
      return setEnabled(entity, !isEnabled(entity));
    }
  }
};

function isEnabled(entity) {
  return entity.muteUntil == null || entity.muteUntil < Date.now();
}

function getHeader(totalHits) {
  return totalHits ? `Alerts (${totalHits})` : 'Alerts';
}

function getEntityName(entity) {
  return `alert "${entity.alertName}"`;
}

function getSubscript(entity) {
  return (
    <Fragment>
      {intersperse(
        [
          !isEnabled(entity) ? <span key="disabled">Disabled</span> : null,
          entity.invalid ? (
            <span key="invalid" className={locals.invalidOrDeprecated}>
              Invalid Query
            </span>
          ) : null
        ].filter(elem => elem),
        <span>, </span>
      )}
    </Fragment>
  );
}
