import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import Counter from 'in-components/tables/ServerTable/components/Counter';
import { ms, percentage, number } from 'in-services/formatters/number';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getServices from 'in-subscription/application/getServices';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getColor } from 'in-applications/endpointTypes';
import { isNotBlank } from 'in-services/util/string';
import ComboBox from 'in-components/ComboBox';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Services.mless';

const pathSegment = '/services';
const matrixPrefix = 'service.';

export default compose(
  withUrlDependingState({
    getPathSegment: () => pathSegment,
    getMatrixPrefix: () => matrixPrefix,
    boundKeys: ['endpointTypes'],
    getInitialState: () => ({ endpointTypes: [] }),
    reducerName: 'setEndpointTypes',
    reducer: (_, endpointTypes) => ({ endpointTypes: endpointTypes }),
    getParsedUrlValues: ({ endpointTypes }) => ({
      endpointTypes: endpointTypes == null ? null : endpointTypes.split(',').filter(isNotBlank)
    }),
    getSerializedUrlValues: ({ endpointTypes }) => ({
      endpointTypes: endpointTypes == null ? null : endpointTypes.join(',')
    })
  })
)(ServiceList);

function ServiceList({ timeConfig, applicationId, serviceId, endpointId, endpointTypes, setEndpointTypes }) {
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
    <ServerTableWithUrlBoundState
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      cardTitle="Services"
      size="compact"
      rightHeader={rightHeader}
      endpointTypes={endpointTypes}
      paginationResettingProps={['applicationId', 'endpointTypes', 'serviceId', 'endpointId', 'timeConfig']}
      defaultOrderBy="callsAgg"
      defaultOrderDirection="DESC"
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
  timeConfig
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
      endpointTypes,
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
    getContent(item, { applicationId, endpointId }) {
      return (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.linkEntityIcon} type="lib_application_service" width={24} height={24} />
          <Link
            href$={getServiceDashboard(item.service.id, {
              applicationId,
              endpointId
            })}
          >
            {item.service.label}
          </Link>
        </div>
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
              <Badge color={getColor(type)} key={type}>
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
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
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
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
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
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  }
];
