import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { getServiceDashboard, servicesList, newServiceView } from 'in-applications/navigation/paths';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import ListViewHeader from 'in-applications/lists/components/ListViewHeader';
import Counter from 'in-components/tables/ServerTable/components/Counter';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { ms, percentage, number } from 'in-services/formatters/number';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getServices from 'in-subscription/application/getServices';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { getColor } from 'in-applications/endpointTypes';
import { isNotBlank } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import ComboBox from 'in-components/ComboBox';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ServicesList.mless';

const matrixPrefix = 'service.';

export default compose(
  connect({ timeConfig: timeConfig$ }),
  withUrlDependingState({
    getPathSegment: () => servicesList,
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
)(ServicesList);

function ServicesList({ timeConfig, setEndpointTypes, endpointTypes }) {
  const rightHeader = (
    <Fragment>
      <Button className={locals.button} kind="action" href$={getModifiedUrlStream(p => (p.pathname = newServiceView))}>
        Custom Service Mapping
      </Button>
      <ComboBox
        className={locals.filter}
        value={endpointTypes}
        onChange={t => setEndpointTypes(t.map(a => a.value))}
        placeholder="Type…"
        multi
        options={getEndpointTypesComboBoxItems()}
      />
    </Fragment>
  );
  return (
    <Sticky header={<ListViewHeader title="Services" />}>
      <MaxWidthFullscreenContainer>
        <Title title="Services" />

        <ViewSwitcher />

        <ServerTableWithUrlBoundState
          get={getTableData}
          pathSegment={servicesList}
          matrixPrefix={matrixPrefix}
          columnDefinitions={columnDefinitions}
          timeConfig={timeConfig}
          endpointTypes={endpointTypes}
          paginationResettingProps={['timeConfig', 'endpointTypes']}
          rightHeader={rightHeader}
          defaultOrderBy="callsAgg"
          defaultOrderDirection="DESC"
          headerClassName={locals.tableHeader}
        />
      </MaxWidthFullscreenContainer>
    </Sticky>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, endpointTypes }) {
  return getServices(
    getServiceListSubscribeEvent(timeConfig, page, pageSize, orderBy, orderDirection, query, endpointTypes)
  );
}

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
    getContent(item) {
      return (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.linkEntityIcon} type="lib_application_service" width={24} height={24} />
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
              <Badge color={getColor(type)} key={type}>
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
          <SvgIcon className={locals.entityIcon} type="lib_application" width={24} height={24} />
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
          <SvgIcon className={locals.entityIcon} type="lib_application_endpoint" width={24} height={24} />
          <Counter>{number.compact(count)}</Counter>
        </div>
      );
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

export function getServiceListSubscribeEvent(
  timeConfig,
  page = 1,
  pageSize = 20,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  query = '',
  endpointTypes = []
) {
  return {
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
      timeConfig,
      endpointTypes
    }
  };
}
