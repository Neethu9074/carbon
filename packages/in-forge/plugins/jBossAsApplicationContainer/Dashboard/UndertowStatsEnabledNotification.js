/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Trans } from 'in-i18n';
import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Code from 'in-components/Code';

const configExample = `<subsystem xmlns="urn:jboss:domain:undertow:2.0" statistics-enabled="true">`;
export default function UndertowStatsEnabledNotification({ snapshot }) {
  const undertowStatsEnabled = snapshot.getIn(['data', 'undertowStatsEnabled'], true);
  if (undertowStatsEnabled) {
    return null;
  }

  return (
    <DashboardNotification type="warning">
      <Trans
        i18nKey="in-forge:plugins.jBossAsApplicationContainer.undertowStatsEnabledNotification"
        components={{
          configCode: <Code code={configExample} />
        }}
      />
    </DashboardNotification>
  );
}
