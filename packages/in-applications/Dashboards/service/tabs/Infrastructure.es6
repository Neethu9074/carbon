import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import getInfrastructure from 'in-subscription/application/getInfrastructure';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ServerTable from 'in-components/tables/ServerTable';
import { timeframe$ } from 'in-stores/timeline';

export default function Infrastructure({ location }) {
  return (
    <MaxWidthFullscreenContainer>
      <ServerTable get={getTableData} pageSize={10} columnDefinitions={getColumnDefinitions()} location={location} />
    </MaxWidthFullscreenContainer>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, location }) {
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
        application: getMatrixParameter(location, serviceDashboard, applicationId),
        service: getMatrixParameter(location, serviceDashboard, serviceId),
        endpoint: getMatrixParameter(location, serviceDashboard, endpointId),
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
        return <LinkToSnapshot snapshotId={item.physicalContext.host} />;
      }
    },
    {
      id: 'host',
      label: 'Host',
      getContent(item) {
        return <LinkToSnapshot snapshotId={item.physicalContext.process} />;
      }
    }
  ];
}

function LinkToSnapshot({ snapshotId }) {
  return <span>{snapshotId}</span>;
}
