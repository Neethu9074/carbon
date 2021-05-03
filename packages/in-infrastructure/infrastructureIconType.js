/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getSvgIcon } from '@instana/components';

import { getIconTypeCallback } from 'in-sdk/iconType';

export function getIconType(snapshotOrPlugin) {
  let plugin = snapshotOrPlugin;
  if (typeof snapshotOrPlugin === 'object') {
    plugin = snapshotOrPlugin.get('plugin');
    const callback = getIconTypeCallback(plugin);
    if (callback) {
      plugin = callback(snapshotOrPlugin);
    }
  }

  const name = `lib_infra_${plugin}`;
  return getSvgIcon(name) ? name : 'lib_infra_unknownIcon';
}
