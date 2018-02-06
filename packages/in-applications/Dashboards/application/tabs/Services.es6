import React from 'react';

import { applicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import getServices from 'in-subscription/application/getServices';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { ms, percentage } from 'in-services/formatters/number';
import ServerTable from 'in-components/tables/ServerTable';
import SparkChart from 'in-components/SparkChart';
import { timeframe$ } from 'in-stores/timeline';
import Link from 'in-components/Link';

export default function ServiceList({ data: { id }, location }) {
  return (
    <MaxWidthFullscreenContainer>
      <ServerTable get={getTableData} pageSize={10} columnDefinitions={getColumnDefinitions(id)} location={location} />
    </MaxWidthFullscreenContainer>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, location }) {
  return timeframe$.flatMap(timeframe =>
    getServices({
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
        application: getMatrixParameter(location, applicationDashboard, applicationId),
        service: getMatrixParameter(location, applicationDashboard, serviceId),
        serviceName: query,
        endpoint: getMatrixParameter(location, applicationDashboard, endpointId),
        timeframe
      }
    })
  );
}

function getColumnDefinitions(appId) {
  return [
    {
      id: 'serviceLabel',
      label: 'Name',
      getContent(item) {
        return <Link href$={getServiceDashboard(item.service.id, { appId })}>{item.service.label}</Link>;
      }
    },
    {
      id: 'Type',
      getContent(item) {
        return item.service.types.join(', ');
      }
    },
    {
      id: 'Endpoints',
      getContent() {
        return 42;
      }
    },
    {
      id: 'Calls',
      getContent() {
        return (
          <SparkChart
            timeframe={{ windowSize: 6000, to: 6000 }}
            metrics={[[0, 10], [1000, 15], [2000, 4], [3000, 3], [4000, 13], [5000, 20], [6000, 16]]}
          />
        );
      }
    },
    {
      id: 'Latency',
      getContent() {
        return (
          <SparkChart
            timeframe={{ windowSize: 6000, to: 6000 }}
            metrics={[[0, 100], [1000, 105], [2000, 400], [3000, 30], [4000, 130], [5000, 200], [6000, 160]]}
            formatter={ms}
          />
        );
      }
    },
    {
      id: 'Errors',
      getContent() {
        return (
          <SparkChart
            timeframe={{ windowSize: 6000, to: 6000 }}
            metrics={[[0, 0.1], [1000, 0.05], [2000, 0.25], [3000, 0.1], [4000, 0.3], [5000, 0], [6000, 0.1]]}
            formatter={percentage}
          />
        );
      }
    }
  ];
}
