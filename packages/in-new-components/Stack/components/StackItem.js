import React from 'react';

import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { Li } from 'in-new-components/lists/List';
import { getIconSvgPath } from 'in-sdk/snapshot';

export default function StackItem({ item: { id, type, label } }) {
  return (
    <Li href$={getDashboardLink(id, { pathname: physicalDashboardPath })}>
      <EntityWithTypeAndIcon type={type} label={label} iconPath={getIconSvgPath(type)} />
    </Li>
  );
}
