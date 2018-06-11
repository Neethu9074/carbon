import { withState } from 'recompose';
import React from 'react';

import InfraTypeSelectButtonGroup from 'in-applications/Dashboards/commonTabs/InfraTypeSelectButtonGroup';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SnapshotLink from 'in-components/tables/ServerTable/components/SnapshotLink';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getInfrastructure from 'in-subscription/application/getInfrastructure';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { number, ms, percentage } from 'in-services/formatters/number';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import ServerTable from 'in-components/tables/ServerTable';
import Link from 'in-components/Link';

export default withState('selectedType', 'setType', 'PROCESS')(Infrastructure);

function Infrastructure({ applicationId, serviceId, endpointId, timeConfig, selectedType, setType }) {
  return (
    <MaxWidthFullscreenContainer>
      <ServerTable
        get={getTableData}
        type={selectedType}
        pageSize={25}
        columnDefinitions={getColumnDefinitions(selectedType)}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
        paginationResettingProps={{ applicationId, serviceId, endpointId, timeConfig }}
        defaultOrderBy="callsAgg"
        defaultOrderDirection="DESC"
        size="compact"
        rightHeader={<InfraTypeSelectButtonGroup selectedType={selectedType} setType={setType} />}
      />
    </MaxWidthFullscreenContainer>
  );
}

function getTableData({
  query,
  page,
  pageSize,
  orderBy,
  orderDirection,
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  type
}) {
  return getInfrastructure({
    category: type,
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    },
    filter: {
      label: query,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeConfig
    }
  });
}

const getColumnDefinitions = type => {
  let infraColumnDefinition;
  if (type == 'PROCESS') {
    infraColumnDefinition = {
      id: 'process',
      label: 'Process',
      getContent(item) {
        if (twoZeroModeEnabled) {
          return <Link href$={getLinkHref(item.physicalContext.process.id)}>{item.physicalContext.process.label}</Link>;
        }
        return <SnapshotLink snapshotPreview={item.physicalContext.process} />;
      }
    };
  } else if (type == 'DOCKER') {
    infraColumnDefinition = {
      id: 'container',
      label: 'Container',
      getContent(item) {
        if (twoZeroModeEnabled) {
          return (
            <Link href$={getLinkHref(item.physicalContext.container.id)}>{item.physicalContext.container.label}</Link>
          );
        }
        return <SnapshotLink snapshotPreview={item.physicalContext.container} />;
      }
    };
  } else if (type == 'HOST') {
    infraColumnDefinition = {
      id: 'host',
      label: 'Host',
      getContent(item) {
        if (twoZeroModeEnabled) {
          return <Link href$={getLinkHref(item.physicalContext.host.id)}>{item.physicalContext.host.label}</Link>;
        }
        return <SnapshotLink snapshotPreview={item.physicalContext.host} />;
      }
    };
  }
  return [
    infraColumnDefinition,
    {
      id: 'callsAgg',
      label: 'Calls',
      getContent(item, { result, timeConfig }) {
        return (
          <SparkChart
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            metrics={item.metrics.calls}
            metric={item.metrics.callsAgg}
            tooltipFormatter={number.compact}
          />
        );
      }
    },
    {
      id: 'latencyAgg',
      label: 'Latency',
      getContent(item, { result, timeConfig }) {
        return (
          <SparkChart
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            metrics={item.metrics.latency}
            metric={item.metrics.latencyAgg}
            tooltipFormatter={ms.compact}
          />
        );
      }
    },
    {
      id: 'errorsAgg',
      label: 'Errors',
      getContent(item, { result, timeConfig }) {
        return (
          <SparkChart
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            metrics={item.metrics.errors}
            metric={item.metrics.errorsAgg}
            tooltipFormatter={percentage.detailed}
          />
        );
      }
    }
  ];
};

function getLinkHref(snapshotId) {
  return getDashboardLink(snapshotId, {
    pathname: '/physical/dashboard'
  });
}
