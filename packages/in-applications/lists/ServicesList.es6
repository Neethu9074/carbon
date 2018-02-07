import React from 'react';

import ApplicationServiceViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationServiceViewBreadcrumb';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BreadcrumbHeader from 'in-applications/TabView/components/BreadcrumbHeader';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import getServices from 'in-subscription/application/getServices';
import { ms, percentage } from 'in-services/formatters/number';
import ServerTable from 'in-components/tables/ServerTable';
import SparkChart from 'in-components/SparkChart';
import { timeframe$ } from 'in-stores/timeline';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';

export default function ServicesList() {
  const breadcrumbs = [<ApplicationServiceViewBreadcrumb />];

  return (
    <Sticky
      header={
        <div>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          <BreadcrumbHeader />
        </div>
      }
    >
      <MaxWidthFullscreenContainer>
        <ViewSwitcher />
        <ServerTable get={getTableData} pageSize={10} columnDefinitions={columnDefinitions} />
      </MaxWidthFullscreenContainer>
    </Sticky>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection }) {
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
        service: query,
        timeframe
      }
    })
  );
}

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
    getContent(item) {
      return <Link href$={getServiceDashboard(item.service.id)}>{item.service.label}</Link>;
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
