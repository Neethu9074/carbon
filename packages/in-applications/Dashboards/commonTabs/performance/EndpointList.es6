import React from 'react';

import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import getEndpoints from 'in-subscription/application/getEndpoints';
import { number, ms, percentage } from 'in-services/formatters/number';
import HttpFilterSelect from 'in-components/HttpFilterSelect';
import ServerTable from 'in-components/tables/ServerTable';
import SparkChart from 'in-components/SparkChart';
import locals from './Performance.mless';

// For services that have HTTP endpoints, we show an HTTP only endpoint list. Otherwise, we show endpoints of all types.
// This does not make too much sense, actually. Why would we want to hide endpoints of type != HTTP whenever HTTP endpoints exist?
// TODO Talk to Rafael if we actually want to make this distinction or just always show all endpoints.

export default class extends React.Component {
  static displayName = 'EndpointList';

  constructor(props) {
    super(props);
    this.state = {
      httpStatus: null,
      httpRequestMethods: null
    };
  }

  onSelectedHttpStatusChange = httpStatus => {
    if (!this.props.httpOnly) {
      return;
    }
    this.setState({ httpStatus });
  };

  onSelectedHttpRequestMethodsChange = httpRequestMethods => {
    if (!this.props.httpOnly) {
      return;
    }
    this.setState({ httpRequestMethods });
  };

  render() {
    let columnDefinitions = [
      {
        id: 'endpointLabel',
        label: 'Endpoint',
        getContent(item) {
          return <span>{item.endpoint.label}</span>;
        }
      }
    ];

    if (this.props.httpOnly) {
      columnDefinitions.push({
        id: 'endpointHttpMethod',
        label: 'Method',
        getContent(item) {
          return <span>{item.endpoint.method}</span>;
        }
      });
    } else {
      columnDefinitions.push({
        id: 'endpointType',
        label: 'Type',
        getContent(item) {
          return <span>{item.endpoint.type}</span>;
        }
      });
    }

    columnDefinitions = columnDefinitions.concat([
      {
        id: 'callsAgg',
        label: 'Calls',
        sortable: false,
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
        sortable: false,
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
        id: 'errors',
        sortable: false,
        getContent() {
          return (
            <SparkChart
              timeframe={{ windowSize: 6000, to: 6000 }}
              metrics={[[0, 0.1], [1000, 0.05], [2000, 0.25], [3000, 0.1], [4000, 0.3], [5000, 0], [6000, 0.1]]}
              formatter={percentage}
            />
          );
        }
      },
      {
        id: 'incidents',
        sortable: false,
        getContent() {
          return <span />;
        }
      }
    ]);

    return (
      <DashboardSection>
        <div className={locals.inlineHeaderWrapper}>
          <h2 className={locals.inlineHeader}>{this.props.httpOnly ? 'Http Endpoints' : 'Endpoints'}</h2>
          {this.props.httpOnly && (
            <HttpFilterSelect
              onSelectedStatusChange={this.onSelectedHttpStatusChange}
              onSelectedMethodsChange={this.onSelectedHttpRequestMethodsChange}
            />
          )}
        </div>
        <ServerTable
          get={getTableData(this.props.httpOnly, this.state.httpRequestMethods)}
          pageSize={10}
          columnDefinitions={columnDefinitions}
          applicationId={this.props.applicationId}
          serviceId={this.props.serviceId}
          timeframe={this.props.timeframe}
        />
      </DashboardSection>
    );
  }
}

function getTableData(httpOnly, httpRequestMethods) {
  return function tableSubscription({
    query,
    page,
    pageSize,
    orderBy,
    orderDirection,
    applicationId,
    serviceId,
    timeframe
  }) {
    return getEndpoints({
      pagination: {
        page,
        pageSize
      },
      order: {
        by: orderBy,
        direction: orderDirection
      },
      metrics: {
        calls: {
          metric: 'calls',
          aggregation: 'SUM',
          granularity: getSparkChartGranularity(timeframe)
        },
        latency: {
          metric: 'latency',
          aggregation: 'MEAN',
          granularity: getSparkChartGranularity(timeframe)
        },
        errorsAgg: {
          metric: 'errors',
          aggregation: 'MEAN'
        }
      },
      filter: {
        label: query,
        endpointType: httpOnly ? 'HTTP' : null,
        application: applicationId,
        service: serviceId,
        timeframe,
        httpRequestMethods
      }
    });
  };
}
