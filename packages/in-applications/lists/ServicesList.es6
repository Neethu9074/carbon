import { compose, withState } from 'recompose';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { ms, percentage, number } from 'in-services/formatters/number';
import getServices from 'in-subscription/application/getServices';
import ServerTable from 'in-components/tables/ServerTable';
import { timeframe$ } from 'in-stores/timeline';
import ComboBox from 'in-components/ComboBox';
import Sticky from 'in-components/Sticky';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ServicesList.mless';

export default compose(connect({ timeframe: timeframe$ }), withState('endpointTypes', 'setEndpointTypes', []))(
  ServicesList
);

function ServicesList({ timeframe, setEndpointTypes, endpointTypes }) {
  const rightHeader = (
    <ComboBox
      value={endpointTypes}
      onChange={t => setEndpointTypes(t.map(a => a.value))}
      placeholder="Type…"
      multi
      options={getEndpointTypesComboBoxItems()}
      className={locals.filter}
    />
  );
  return (
    <Sticky header={<ViewSwitcher />}>
      <MaxWidthFullscreenContainer className={locals.block}>
        <ServerTable
          get={getTableData}
          pageSize={25}
          columnDefinitions={columnDefinitions}
          timeframe={timeframe}
          endpointTypes={endpointTypes}
          paginationResettingProps={{ endpointTypes, timeframe }}
          rightHeader={rightHeader}
        />
      </MaxWidthFullscreenContainer>
    </Sticky>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeframe, endpointTypes }) {
  return getServices({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      applications: {
        metric: 'applications',
        aggregation: 'DISTINCT_COUNT'
      },
      endpoints: {
        metric: 'endpoints',
        aggregation: 'DISTINCT_COUNT'
      },
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeframe)
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeframe)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeframe)
      }
    },
    filter: {
      label: query,
      timeframe,
      endpointTypes
    }
  });
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
    sortable: false,
    getContent(item) {
      return item.service.types.join(', ');
    }
  },
  {
    id: 'applications',
    label: 'Applications',
    getContent(item) {
      return number.compact(item.metrics.applications[0][1]);
    }
  },
  {
    id: 'endpoints',
    label: 'Endpoints',
    getContent(item) {
      return number.compact(item.metrics.endpoints[0][1]);
    }
  },
  {
    id: 'callsAgg',
    label: 'Calls',
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
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
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
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
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={percentage.compact}
        />
      );
    }
  }
];
