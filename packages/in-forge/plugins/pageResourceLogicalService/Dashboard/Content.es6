import React from 'react';

import PageAssetCharts from 'in-forge/plugins/pageResourceLogicalService/Dashboard/PageAssetCharts';
import PageAssetTable from 'in-forge/plugins/pageResourceLogicalService/Dashboard/PageAssetTable';
import Kpis from 'in-forge/plugins/pageResourceLogicalService/Dashboard/Kpis';

export default function PageResourceLogicalServiceDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <Kpis snapshot={snapshot} />

      <PageAssetCharts snapshotId={snapshot.get('id')} timeConfig={timeConfig} />

      <PageAssetTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
