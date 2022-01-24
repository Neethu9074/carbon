/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import * as Immutable from 'immutable';

import { getSvgIcon } from '@instana/components';

import { getIconTypeCallback } from 'in-sdk/iconType';

type SnapshotOrPlugin = Immutable.Map<string, unknown> | string;

export function getIconType(snapshotOrPlugin: SnapshotOrPlugin): string {
  let plugin = snapshotOrPlugin;
  if (typeof snapshotOrPlugin === 'object') {
    plugin = snapshotOrPlugin.get('plugin') as string;
    const callback = getIconTypeCallback(plugin);
    if (callback) {
      plugin = callback(snapshotOrPlugin);
    }
  }

  const name = `lib_infra_${plugin}`;
  return getSvgIcon(name) ? name : 'lib_infra_unknownIcon';
}
