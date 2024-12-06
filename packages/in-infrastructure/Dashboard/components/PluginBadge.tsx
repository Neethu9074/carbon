/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { getPluginName } from 'in-sdk/pluginName';

import locals from './PluginBadge.mless';

export default function PluginBadge({ plugin }: { plugin: string }) {
  const snapshotDefinition = getOptionalSnapshotDefinition(plugin);
  return <div className={locals.pluginLabel}>{snapshotDefinition ? getPluginName(plugin, 1) : plugin}</div>;
}
