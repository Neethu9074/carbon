import React from 'react';

import locals from './PluginBadge.mless';

export default function PluginBadge({ plugin }) {
  return <div className={locals.pluginLabel}>{plugin}</div>;
}
