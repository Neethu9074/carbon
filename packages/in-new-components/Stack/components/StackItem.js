import React from 'react';

import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { getIconSvgPath } from 'in-sdk/snapshot';

import locals from './StackItem.mless';

export default function StackItem({ item: { id, type, label } }) {
  return (
    <div className={locals.item}>
      <EntityWithTypeAndIcon
        type={type}
        label={label}
        iconPath={getIconSvgPath(type)}
        href$={getDashboardLink(id, { pathname: physicalDashboardPath })}
      />
    </div>
  );
}
