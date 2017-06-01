import React from 'react';

import PageAssetCharts from 'in-forge/plugins/pageResourceLogicalService/Dashboard/PageAssetCharts';
import PageAssetTable from 'in-forge/plugins/pageResourceLogicalService/Dashboard/PageAssetTable';
import Kpis from 'in-forge/plugins/pageResourceLogicalService/Dashboard/Kpis';

export default function PageResourceLogicalServiceDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <Kpis snapshot={snapshot} />

      <PageAssetCharts snapshotId={snapshot.get('id')} timeframe={timeframe} />

      <PageAssetTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
