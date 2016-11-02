import React from 'react';

import DataSourcesTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/DataSourcesTable';
import ConnectorsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ConnectorsTable';
import ExecutorsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ExecutorsTable';
import WebAppsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/WebAppsTable';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import {zeroDecimalPlaces} from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function TomcatDashboard({snapshot, timeframe}) {
  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>

        <KpiKeyValue label='#Sessions'>
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='totalSessionCount'
                       formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <WebAppsTable snapshot={snapshot}
                    timeframe={timeframe} />
      <ConnectorsTable snapshot={snapshot}
                       timeframe={timeframe} />
      <ExecutorsTable snapshot={snapshot}
                      timeframe={timeframe} />
      <DataSourcesTable snapshot={snapshot}
                        timeframe={timeframe} />
    </div>
  );
}
