import React from 'react';

import PluginIcon from 'in-components/PluginIcon';

export function translateContext(context, snapshot) {
  return context.map(ctx => {
    if (typeof ctx === 'function') {
      return {
        label: ctx(snapshot),
        icon: <PluginIcon snapshot={snapshot} />
      };
    } else {
      return {
        label: ctx,
        icon: null
      };
    }
  });
}
