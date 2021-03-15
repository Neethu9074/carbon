/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import FrontendsTable from 'in-forge/plugins/hAProxy/Dashboard/FrontendsTable';
import BackendsTable from 'in-forge/plugins/hAProxy/Dashboard/BackendsTable';
import { Trans, t, markAsSecureString } from 'in-i18n';

export default function HAProxyDashboard({ snapshot, timeConfig }) {
  const socketPath = snapshot.getIn(['data', 'socketPath']);
  if (!socketPath) {
    return (
      <DashboardNotification type="info">
        <Trans
          i18nKey="in-forge:plugins.haProxy.dashboard.haProxyIsNotConfiguredForSocketAccessPleaseConfigureStatsSocketToPointToAUnixSocket"
          values={{ code: 'stats socket' }}
        />
      </DashboardNotification>
    );
  }

  const multiProcessModeConfigured = snapshot.getIn(['data', 'multiProcessModeConfigured'], 'OK');
  return (
    <div>
      {multiProcessModeConfigured !== 'OK' ? (
        <DashboardNotification type="info">
          {t('in-forge:plugins.hAProxy.dashboard.haProxyIsDetectedToBeInMultiProcessMode')}
          <br />
          {t('in-forge:plugins.hAProxy.dashboard.toBeAbleToProperlyMonitorHaProxyInMultiProcessMode')}
          <br />
          <br />
          <Trans
            i18nKey="in-forge:plugins.haProxy.dashboard.eGStatsSocketRunHaproxyAdmin1SockMode660LevelAdminProcess1"
            values={{
              code: markAsSecureString('stats socket /run/haproxy/admin1.sock mode 660 level admin process 1')
            }}
          />
        </DashboardNotification>
      ) : null}

      <FrontendsTable snapshot={snapshot} timeConfig={timeConfig} />
      <BackendsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
