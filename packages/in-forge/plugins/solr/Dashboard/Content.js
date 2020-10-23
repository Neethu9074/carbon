import React from 'react';

import CoresTable from 'in-forge/plugins/solr/Dashboard/CoresTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';

export default function SolrDashboard({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type="warning">
        Jmx module is not enabled in solr. Please enable it to be able to collect data. You can do so, by adding &lt;jmx
        /&gt; to solrconfig.xml.
      </DashboardNotification>
    );
  }
  return <CoresTable snapshot={snapshot} timeConfig={timeConfig} />;
}
