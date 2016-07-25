import irpt from 'react-immutable-proptypes';
import React from 'react';

import WebsitesTable from 'in-forge/plugins/msiis/Dashboard/WebsitesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import {emptyList} from 'in-services/fixedImmutables';
import {timeframeShape} from 'in-stores/timeline';


export default function MsIISDashboard({snapshot, timeframe}) {
  const allPools = snapshot.getIn(['data', 'allpools'], emptyList).toArray();

  return (
    <div>
      <WebsitesTable snapshot={snapshot}
                     timeframe={timeframe} />

      <DashboardSection title='Application-Pools'>
        <ResponsiveTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>ASP.NET Version</th>
            </tr>
          </thead>
          <tbody>
            {allPools.map(pool =>
              <tr key={pool}>
                <td>{pool}</td>
                <td>{snapshot.getIn(['data', 'iis.apppools', pool, 'runtimeversion'])}</td>
              </tr>
            )}
          </tbody>
        </ResponsiveTable>
      </DashboardSection>
    </div>
  );
}

MsIISDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
