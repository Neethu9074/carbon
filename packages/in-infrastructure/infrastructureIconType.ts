/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getSvgIcon } from '@instana/components';

import { SnapshotMap } from 'in-components/EntityLink';
import { getIconTypeCallback } from 'in-sdk/iconType';

type SnapshotOrPlugin = SnapshotMap | string;

export function getIconType(snapshotOrPlugin: SnapshotOrPlugin): string {
  let plugin = typeof snapshotOrPlugin === 'object' ? (snapshotOrPlugin.get('plugin') as string) : snapshotOrPlugin;
  const callback = getIconTypeCallback(plugin);
  if (callback) {
    if (typeof snapshotOrPlugin === 'object') {
      plugin = callback(snapshotOrPlugin);
    } else {
      plugin = callback(plugin);
    }
  }

  const name = `lib_infra_${plugin}`;
  const nameAlt = `lib_${plugin}`;
  return getSvgIcon(name) ? name : getSvgIcon(nameAlt) ? nameAlt : 'lib_infra_unknownIcon';
}
