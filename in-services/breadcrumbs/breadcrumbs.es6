import React from 'react';

import PluginIcon from 'in-components/PluginIcon';

export function translateContext(context, snapshot) {
  return context.map(ctx => {
    const path = ctx.path;
    let label = ctx.label;
    let icon = null;

    if (typeof ctx.label === 'function') {
      label = ctx.label(snapshot);
      icon = <PluginIcon snapshot={snapshot} />;
    }

    return {
      label: label,
      path: path,
      icon: icon
    };
  });
}
