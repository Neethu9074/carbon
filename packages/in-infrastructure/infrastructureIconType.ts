/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getSvgIcon } from '@instana/components';

import { SnapshotMap } from 'in-components/EntityLink';
import { getIconTypeCallback } from 'in-sdk/iconType';

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
  const nameAlt = `lib_${(plugin as String).toLowerCase()}`;
  return getSvgIcon(name) ? name : getSvgIcon(nameAlt) ? nameAlt : 'lib_infra_unknownIcon';
}
