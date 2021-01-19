/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import FrontendsTable from 'in-forge/plugins/hAProxy/Dashboard/FrontendsTable';
import BackendsTable from 'in-forge/plugins/hAProxy/Dashboard/BackendsTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';

export default function HAProxyDashboard({ snapshot, timeConfig }) {
  const socketPath = snapshot.getIn(['data', 'socketPath']);
  if (!socketPath) {
    return (
      <DashboardNotification type="info">
        HAProxy is not configured for socket access. Please configure <code>stats socket</code> to point to a UNIX
        socket.
      </DashboardNotification>
    );
  }

  const multiProcessModeConfigured = snapshot.getIn(['data', 'multiProcessModeConfigured'], 'OK');
  return (
    <div>
      {multiProcessModeConfigured !== 'OK' ? (
        <DashboardNotification type="info">
          HAProxy is detected to be in multi-process mode, but no process attribute is detected in &apos;stats
          socket&apos; configuration.
          <br />
          To be able to properly monitor HAProxy in multi-process mode, stats socket binding should be defined per
          socket using the &apos;process&apos; attribute.
          <br />
          <br />
          E.g. <code>stats socket /run/haproxy/admin1.sock mode 660 level admin process 1</code>
        </DashboardNotification>
      ) : null}

      <FrontendsTable snapshot={snapshot} timeConfig={timeConfig} />
      <BackendsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
