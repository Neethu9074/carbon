import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import Counter from 'in-components/tables/ServerTable/components/Counter';
import { ms, percentage, number } from 'in-services/formatters/number';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getServices from 'in-subscription/application/getServices';
import ServerTable from 'in-components/tables/ServerTable';
import { getColor } from 'in-applications/endpointTypes';
import ComboBox from 'in-components/ComboBox';
import Link from 'in-components/Link';

import locals from './Services.mless';

export default compose(withState('endpointTypes', 'setEndpointTypes', []))(ServiceList);

function ServiceList({ timeframe, applicationId, serviceId, endpointId, endpointTypes, setEndpointTypes }) {
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
    <ServerTable
      get={getTableData}
      pageSize={25}
      columnDefinitions={columnDefinitions}
      timeframe={timeframe}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      cardTitle="Services"
      rightHeader={rightHeader}
      endpointTypes={endpointTypes}
      paginationResettingProps={{ applicationId, endpointTypes, serviceId, endpointId, timeframe }}
    />
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
  endpointTypes,
  timeframe
}) {
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
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      endpointTypes,
      timeframe
    }
  });
}

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
    getContent(item, { applicationId, endpointId }) {
      return (
        <Link
          href$={getServiceDashboard(item.service.id, {
            applicationId,
            endpointId
          })}
        >
          {item.service.label}
        </Link>
      );
    }
  },
  {
    id: 'Type',
    sortable: false,
    getContent(item) {
      return (
        <Fragment>
          {item.service.types
            .slice()
            .sort()
            .map(type => (
              <Badge size="sm" color={getColor(type)} key={type}>
                {type}
              </Badge>
            ))}
        </Fragment>
      );
    }
  },
  {
    id: 'endpoints',
    label: 'Endpoints',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'endpoints', 0, 1], 0);
      return <Counter>{number.compact(count)}</Counter>;
    }
  },
  {
    id: 'callsAgg',
    label: 'Calls',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
          aggregation="SUM"
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
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
          aggregation="MEAN"
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
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
          aggregation="MEAN"
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={percentage.compact}
        />
      );
    }
  }
];
