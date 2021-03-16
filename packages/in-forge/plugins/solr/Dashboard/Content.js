/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import CoresTable from 'in-forge/plugins/solr/Dashboard/CoresTable';
import { t } from 'in-i18n';

export default function SolrDashboard({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type="warning">
        {t('in-forge:plugins.solr.dashboard.SolrDashboardWarning')}
      </DashboardNotification>
    );
  }
  return <CoresTable snapshot={snapshot} timeConfig={timeConfig} />;
}
