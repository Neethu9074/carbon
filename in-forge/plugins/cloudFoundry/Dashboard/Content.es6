import React from 'react';

import {
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesZeroDecimalPlaces
} from 'in-services/formatters/number';

import ApplicationsTable from 'in-forge/plugins/cloudFoundry/Dashboard/ApplicationsTable';
import DiegoTable from 'in-forge/plugins/cloudFoundry/Dashboard/DiegoTable';
import DopplerTable from 'in-forge/plugins/cloudFoundry/Dashboard/DopplerTable';
import DEATable from 'in-forge/plugins/cloudFoundry/Dashboard/DEATable';
import CloudControllerTable from 'in-forge/plugins/cloudFoundry/Dashboard/CloudControllerTable';
import HealthManagerTable from 'in-forge/plugins/cloudFoundry/Dashboard/HealthManagerTable';

export const noDataDecimalFormatter = d => d < 0 ?
  'No data' : zeroDecimalPlaces(d);
export const noDataPercentageFormatter = d => d < 0 ?
  'No data' : percentageTwoDecimalPlaces(d);
export const noDataBytesFormatter = d => d < 0 ?
  'No data' : bytesZeroDecimalPlaces(d);

export default function CloudFoundryDashboard({snapshot, timeframe}) {
  return (
    <div>
      <ApplicationsTable snapshot={snapshot}
                         timeframe={timeframe} />

      <DiegoTable snapshot={snapshot}
                  timeframe={timeframe} />

      <DopplerTable snapshot={snapshot}
                    timeframe={timeframe} />

      <DEATable snapshot={snapshot}
                timeframe={timeframe} />

      <CloudControllerTable snapshot={snapshot}
                            timeframe={timeframe} />

      <HealthManagerTable snapshot={snapshot}
                          timeframe={timeframe} />

    </div>
  );
}
