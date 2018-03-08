import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import EndpointTypeSelect, {
  mapServicesResultToComboBoxItems
} from 'in-applications/Dashboards/commonComponents/EndpointTypeSelect/EndpointTypeSelect';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import Counter from 'in-components/tables/ServerTable/components/Counter';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { ms, percentage, number } from 'in-services/formatters/number';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getServices from 'in-subscription/application/getServices';
import ServerTable from 'in-components/tables/ServerTable';
import { getColor } from 'in-applications/endpointTypes';
import { timeframe$ } from 'in-stores/timeline';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ServicesList.mless';

export default compose(connect({ timeframe: timeframe$ }), withState('endpointTypes', 'setEndpointTypes', []))(
  ServicesList
);

function ServicesList({ timeframe, setEndpointTypes, endpointTypes }) {
  function renderRightHeader(result, endpointTypes, setEndpointTypes) {
    return (
      <EndpointTypeSelect
        setEndpointTypes={setEndpointTypes}
        endpointTypes={endpointTypes}
        availableTypes={mapServicesResultToComboBoxItems(result)}
      />
    );
  }

  return (
    <Sticky header={<ViewSwitcher />}>
      <MaxWidthFullscreenContainer className={locals.block}>
        <Title title="Services" />
        <ServerTable
          get={getTableData}
          pageSize={25}
          columnDefinitions={columnDefinitions}
          timeframe={timeframe}
          endpointTypes={endpointTypes}
          paginationResettingProps={{ endpointTypes, timeframe }}
          renderRightHeader={props => renderRightHeader(props.result, endpointTypes, setEndpointTypes)}
          defaultOrderBy="callsAgg"
          defaultOrderDirection="DESC"
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
      return (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.entityIcon} type="app_service" width={20} height={20} color="#6c8a91" />
          <Link href$={getServiceDashboard(item.service.id)}>{item.service.label}</Link>
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
              <Badge size="sm" color={getColor(type)} key={type}>
                {type}
              </Badge>
            ))}
        </Fragment>
      );
    }
  },
  {
    id: 'applications',
    label: 'Applications',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'applications', 0, 1], 0);
      return (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.entityIcon} type="app_application" width={20} height={20} color="#6c8a91" />
          <Counter>{number.compact(count)}</Counter>
        </div>
      );
    }
  },
  {
    id: 'endpoints',
    label: 'Endpoints',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'endpoints', 0, 1], 0);
      return (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.entityIcon} type="app_endpoint" width={20} height={20} color="#6c8a91" />
          <Counter>{number.compact(count)}</Counter>
        </div>
      );
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
