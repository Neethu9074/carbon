/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getSvgIcon } from '@instana/components';

import { getIconTypeCallback } from 'in-sdk/iconType';
import { SnapshotMap } from 'in-components/EntityLink';

type SnapshotOrPlugin = SnapshotMap | string;

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
