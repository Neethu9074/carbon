import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import Code from 'in-components/Code';

const configExample = `<subsystem xmlns="urn:jboss:domain:undertow:2.0" statistics-enabled="true">`;
export default function UndertowStatsEnabledNotification({ snapshot }) {
  const undertowStatsEnabled = snapshot.getIn(['data', 'undertowStatsEnabled'], true);
  if (undertowStatsEnabled) {
    return null;
  }

  return (
    <DashboardNotification type="warning">
      <strong>Statistics are not enabled for undertow subsystem</strong>

      <p>
        This means that we can not collect servlet statistics from JBoss.
        To enable statistics, set <code>statistics-enabled</code> attribute to <code>true</code> for undertow subsystem
        configuration in server
        configuration. For this change to take effect server reboot is required. Example:
        <Code code={configExample} />
      </p>
    </DashboardNotification>
  );
}
