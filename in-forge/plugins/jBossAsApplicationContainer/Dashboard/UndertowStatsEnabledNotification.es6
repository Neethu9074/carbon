import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import Code from 'in-components/Code';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const configExample = `<subsystem xmlns="urn:jboss:domain:undertow:2.0" statistics-enabled="true">`;
export default connectTo(
  props => {
    return {
      undertowStatsEnabled: getRawPayload(props.snapshot.get('id'), 'undertowStatsEnabled')
    };
  },
  function HealthcheckResultDescriptionItem({ undertowStatsEnabled, timeframe }) {
    if (undertowStatsEnabled != false || timeframe.to != null) {
      return null;
    }

    return (
      <DashboardNotification type="warning">
        <strong>Statistics are not enabled for undertow subsystem</strong>

        <p>
          This means that we can not collect servlet statistics from JBoss.
          To enable statistics, set statistics-enabled attribute to true for undertow subsystem configuration in server
          configuration. For this change to take effect server reboot is required.
          <Code code={configExample} />
        </p>
      </DashboardNotification>
    );
  }
);
