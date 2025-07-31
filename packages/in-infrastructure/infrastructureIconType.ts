/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getSvgIcon } from '@instana/components';

import { isKubernetesControlPlanePlugins } from 'in-forge/plugins/pluginTypes';
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

  // Temporary custom entities icon hack until icon is created
  if (plugin === 'customEntities') {
    return 'lib_openTelemetry';
  }

  // Temporary icons for k8s control plane.
  if (isKubernetesControlPlanePlugins(plugin)) {
    return 'lib_kubernetes';
  }

  const name = `lib_infra_${plugin}`;
  const nameAlt = `lib_${plugin}`;
  return getSvgIcon(name) ? name : getSvgIcon(nameAlt) ? nameAlt : 'lib_infra_unknownIcon';
}
