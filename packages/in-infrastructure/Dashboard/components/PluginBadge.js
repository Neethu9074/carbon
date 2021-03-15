/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getPluginName } from 'in-sdk/pluginName';

import locals from './PluginBadge.mless';

export default function PluginBadge({ plugin }) {
  return <div className={locals.pluginLabel}>{getPluginName(plugin, 1)}</div>;
}
