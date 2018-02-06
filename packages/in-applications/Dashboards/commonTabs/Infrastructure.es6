import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import SnapshotLink from 'in-components/tables/ServerTable/components/SnapshotLink';
import getInfrastructure from 'in-subscription/application/getInfrastructure';
import ServerTable from 'in-components/tables/ServerTable';
import { timeframe$ } from 'in-stores/timeline';

export default function Infrastructure({ applicationId, serviceId, endpointId }) {
  return (
    <MaxWidthFullscreenContainer>
      <ServerTable
        get={getTableData}
        pageSize={10}
        columnDefinitions={getColumnDefinitions()}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
      />
    </MaxWidthFullscreenContainer>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, applicationId, serviceId, endpointId }) {
  return timeframe$.flatMap(timeframe =>
    getInfrastructure({
      pagination: {
        page,
        pageSize
      },
      order: {
        by: orderBy,
        direction: orderDirection
      },
      metrics: {},
      filter: {
        infrastructureName: query,
        application: applicationId,
        service: serviceId,
        endpoint: endpointId,
        timeframe
      }
    })
  );
}

function getColumnDefinitions() {
  return [
    {
      id: 'label',
      label: 'Process',
      getContent(item) {
        return <SnapshotLink snapshotId={item.physicalContext.process} />;
      }
    },
    {
      id: 'host',
      label: 'Host',
      getContent(item) {
        return <SnapshotLink snapshotId={item.physicalContext.host} />;
      }
    }
  ];
}
