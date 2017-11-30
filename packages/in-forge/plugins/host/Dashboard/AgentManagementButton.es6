import React from 'react';

import getAgentSnapshotId from 'in-services/subscription/getAgentSnapshotId';
import { getDashboardLink } from 'in-stores/navigation';
import { isEntityOnline } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      isOnline: isEntityOnline(props.snapshot.get('id')),
      href: getAgentSnapshotId(props.snapshot).flatMap(getDashboardLink)
    };
  },
  function EnableSelfMonitoringButton({ isOnline, href }) {
    const button = (
      <Button kind="default" disabled={!isOnline} href={href}>
        Open Agent Management
      </Button>
    );

    if (isOnline || !href) {
      return button;
    }

    return <Tooltip content="Agent management is only available when the agent is running.">{button}</Tooltip>;
  }
);
