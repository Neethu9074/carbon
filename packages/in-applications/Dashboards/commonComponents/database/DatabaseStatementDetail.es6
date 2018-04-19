import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import getDatabaseStatement from 'in-subscription/application/getDatabaseStatement';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import { millis, number, percentage } from 'in-services/formatters/number';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { getChartGranularity } from 'in-applications/metrics';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getModifiedUrlStream } from 'in-stores/navigation';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { shorten } from 'in-services/util/string';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default connectTo(
  props => ({
    statementResult: getDatabaseStatement({ id: props.match.params.statementId, timeframe: props.timeframe })
  }),
  function DatabaseStatementDetail(props) {
    const { statementResult } = props;

    if (!statementResult) {
      return null;
    }

    let content;
    if (statementResult.progress.loading) {
      content = <DashboardSkeleton />;
    } else if (statementResult.errors && statementResult.errors.length > 0) {
      content = <ErroneousResultPresenter errors={statementResult.errors} />;
    } else {
      content = <Success statement={statementResult.data} {...props} />;
    }

    return (
      <Fragment>
        <Breadcrumbs
          items={[
            <Breadcrumb label="Database Statement">
              {statementResult.data && shorten(statementResult.data.statement, 32)}
            </Breadcrumb>
          ]}
        />
        {content}
      </Fragment>
    );
  }
);

function Success({ statement, timeframe, applicationId, serviceId, endpointId }) {
  const granularity = getChartGranularity(timeframe);
  const filter = {
    timeframe,
    endpoint: endpointId,
    application: applicationId,
    service: serviceId,
    databaseStatementId: statement.id
  };
  const queryResult = formatJsonOrSql(statement.statement);

  return (
    <MaxWidthFullscreenContainer>
      <Title title="Database Statement Details" dynamic={statement.statement} />
      <BackButton
        label="Back"
        href$={getModifiedUrlStream(
          params => (params.pathname = params.pathname.replace(/\/database\/statements\/.*/, ''))
        )}
      />

      <Row>
        <Col lg={4}>
          <AppDataKpiCard
            title="Total Calls"
            formatter={number.compact}
            metricsConfig={{
              filter,
              metrics: {
                calls: {
                  metric: 'calls',
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
        <Col lg={4}>
          <AppDataKpiCard
            title="Avg. Latency"
            formatter={millis.detailed}
            metricsConfig={{
              filter,
              metrics: {
                latency: {
                  metric: 'latency',
                  aggregation: 'MEAN'
                }
              }
            }}
          />
        </Col>
        <Col lg={4}>
          <AppDataKpiCard
            title="Error Rate"
            formatter={percentage.detailed}
            metricsConfig={{
              filter,
              metrics: {
                errors: {
                  metric: 'errors',
                  aggregation: 'MEAN'
                }
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ChartWrapper
            cardTitle="Total Calls vs Avg. Latency"
            timeframe={timeframe}
            y1={{
              renderer: Renderer.countErrorBar,
              labels: ['Calls', 'Errors'],
              metricIds: ['calls', 'errors']
            }}
            y2={{
              renderer: Renderer.line,
              labels: ['Latency'],
              metricIds: ['latency'],
              formatter: millis
            }}
            metricsConfiguration={{
              filter,
              metrics: {
                calls: {
                  metric: 'calls',
                  granularity,
                  aggregation: 'SUM'
                },
                errors: {
                  metric: 'errors',
                  granularity,
                  aggregation: 'MEAN'
                },
                latency: {
                  metric: 'latency',
                  granularity,
                  aggregation: 'MEAN'
                }
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card title="Statement">
            <Code code={queryResult.code} lang={queryResult.lang} />
          </Card>
        </Col>
      </Row>
    </MaxWidthFullscreenContainer>
  );
}

function DashboardSkeleton() {
  return (
    <MaxWidthFullscreenContainer>
      <Title title="Database Statement Details" />
      <BackButton
        label="Back"
        href$={getModifiedUrlStream(
          params => (params.pathname = params.pathname.replace(/\/database\/statements\/.*/, ''))
        )}
      />

      <DefaultLoadingDashboard />
    </MaxWidthFullscreenContainer>
  );
}

function formatJsonOrSql(queryStatement) {
  let jsonQuery = tryFormatJsonQuery(queryStatement);
  if (jsonQuery) return { code: jsonQuery, lang: 'json' };
  return { code: formatSql(queryStatement), lang: 'sql' };
}

function tryFormatJsonQuery(query) {
  let json;
  try {
    json = JSON.parse(query);
  } catch (e) {
    return null;
  }
  return JSON.stringify(json, 0, 2);
}
