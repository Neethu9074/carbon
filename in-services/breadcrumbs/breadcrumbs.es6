import React from 'react';

import PluginIcon from 'in-components/PluginIcon';

export function translateBreadcrumbStructure(navigation, currentPathname, snapshot) {
  const result = [];

  for (const key of Object.keys(navigation)) {
    const nav = navigation[key];

    let label = nav.label;
    let icon = null;

    if (typeof nav.label === 'function') {
      label = nav.label(snapshot);
      icon = <PluginIcon snapshot={snapshot} />;
    }

    result.push({
      path: key,
      label,
      icon
    });

    //only take those into account until we are at the current navigation point
    if (key === currentPathname) {
      break;
    }
  }

  return result;
}
