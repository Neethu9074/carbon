import React from 'react';

import { getSingular } from 'in-sdk/pluginName';

import locals from './PluginBadge.mless';

export default function PluginBadge({ plugin }) {
  return <div className={locals.pluginLabel}>{getSingular(plugin)}</div>;
}
