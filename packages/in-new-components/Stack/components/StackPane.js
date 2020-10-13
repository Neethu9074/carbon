import React from 'react';

import StackGroup from 'in-new-components/Stack/components/StackGroup';
import ScrollHints from 'in-components/ScrollHints';

import locals from './StackPane.mless';

export default function StackPane({ applicationId, boundaryScope, serviceId, groups, tab }) {
  return (
    <ScrollHints className={locals.pane} contentChangeMarker={groups.length}>
      {groups.map(group => (
        <StackGroup
          key={`${group.relationship}.${group.type}`}
          applicationId={applicationId}
          boundaryScope={boundaryScope}
          serviceId={serviceId}
          group={group}
          tab={tab}
        />
      ))}
    </ScrollHints>
  );
}
