/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getAgentSnapshotId from 'in-subscription/getAgentSnapshotId';
import { isEntityOnline } from 'in-stores/snapshot';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
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
      <Button kind="primary" disabled={!isOnline} href={href}>
        Open Agent Management
      </Button>
    );

    if (isOnline || !href) {
      return button;
    }

    return <Tooltip content="Agent management is only available when the agent is running.">{button}</Tooltip>;
  }
);
