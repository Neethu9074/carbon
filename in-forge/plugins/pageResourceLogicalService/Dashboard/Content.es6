import React from 'react';

import DefaultKpiSection from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultKpiSection';
import PageAssetCharts from 'in-forge/plugins/pageResourceLogicalService/Dashboard/PageAssetCharts';
import PageAssetTable from 'in-forge/plugins/pageResourceLogicalService/Dashboard/PageAssetTable';

export default function PageResourceLogicalServiceDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <DefaultKpiSection snapshot={snapshot} />

      <PageAssetCharts snapshotId={snapshot.get('id')} timeframe={timeframe} />

      <PageAssetTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
