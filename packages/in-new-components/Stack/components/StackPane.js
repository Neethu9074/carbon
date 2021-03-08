/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import StackGroup from 'in-new-components/Stack/components/StackGroup';

import locals from './StackPane.mless';

export default function StackPane({ applicationId, boundaryScope, serviceId, groups, tab, syntheticCalls }) {
  return (
    <div className={locals.pane}>
      {groups.map(group => (
        <StackGroup
          key={`${group.relationship}.${group.type}`}
          applicationId={applicationId}
          boundaryScope={boundaryScope}
          serviceId={serviceId}
          group={group}
          tab={tab}
          syntheticCalls={syntheticCalls}
        />
      ))}
    </div>
  );
}
