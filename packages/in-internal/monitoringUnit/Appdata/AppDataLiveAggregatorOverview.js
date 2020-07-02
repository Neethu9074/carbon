import React from 'react';

import AppDataLiveAggregatorValidation from 'in-internal/monitoringUnit/Appdata/AppDataLiveAggregatorValidation';
import AppDataLiveAggregator from 'in-internal/monitoringUnit/Appdata/AppDataLiveAggregator';

export default function AppDataLiveAggregatorOverview() {
  return (
    <>
      <AppDataLiveAggregator />
      <AppDataLiveAggregatorValidation />
    </>
  );
}
