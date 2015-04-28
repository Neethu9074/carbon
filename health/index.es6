'use strict';

import {createLogger} from 'instalog';
import invariant from 'invariant';

const logger = createLogger('ui-sdk.health');

// pluginId: (snapshot) => Health
const mappings = {};

export const health = {
  ok: 'ok',
  warning: 'warning',
  danger: 'danger'
};

export function addMapping(pluginId, healthProvider) {
  if (pluginId in mappings) {
    logger.info(
      'Duplicated registration of healthProvider for pluginId' + pluginId
    );
  }
  mappings[pluginId] = healthProvider;
}

export function getHealth(snapshot) {
  const pluginId = snapshot.get('pluginId');
  const mapping = mappings[pluginId];
  if (!mapping) {
    const msg = 'No healthProvider for pluginId ' + pluginId + ' found.';
    logger.error(msg);
    throw new Error(msg);
  }
  const determinedHealth = mapping(snapshot);
  invariant(
    [health.ok, health.warning, health.danger].indexOf(determinedHealth) >= 0,
    'Unknown health determined by healthProvider for plugin ' + pluginId
  );
  return determinedHealth;
}
