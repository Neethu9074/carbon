import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getDatabaseStatement from 'in-subscription/application/getDatabaseStatement';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import { millis, number, percentage } from 'in-services/formatters/number';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Code from 'in-sdk/components/traceDetails/Code';
import Skeleton from 'in-components/Progress/Skeleton';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { shorten } from 'in-services/util/string';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './DatabaseStatementDetail.mless';

export default connectTo(
  props => ({
    statementResult: getDatabaseStatement({ id: props.match.params.statementId })
  }),
  function DatabaseStatementDetail({ statementResult }) {
    if (!statementResult) {
      return null;
    }

    let content;
    if (statementResult.progress.loading) {
      content = <DashboardSkeleton />;
    } else if (statementResult.errors && statementResult.errors.length > 0) {
      content = <ErroneousResultPresenter errors={statementResult.errors} />;
    } else {
      content = renderStatementData(statementResult.data);
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

function renderStatementData(statmentData) {
  return (
    <MaxWidthFullscreenContainer>
      <Title title="Database Statement Details" />
      <BackButton
        label="Back"
        href$={getModifiedUrlStream(params => {
          params.pathname = params.pathname.replace(/\/database\/statements\/.*/, '');
        })}
      />

      <Row>
        <Col lg={4}>
          <KpiCard title="Calls" value={number.compact(statmentData.metrics.calls)} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Latency" value={millis.detailed(statmentData.metrics.latency)} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Errors" value={percentage.detailed(statmentData.metrics.errors)} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card title="Statement">
            <Code code={formatSql(statmentData.statement)} lang="sql" />
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
        href$={getModifiedUrlStream(params => {
          params.pathname = params.pathname.replace(/\/database\/statements\/.*/, '');
        })}
      />

      <Row>
        <Col lg={4}>
          <Skeleton className={locals.kpiSkeleton} />
        </Col>
        <Col lg={4}>
          <Skeleton className={locals.kpiSkeleton} />
        </Col>
        <Col lg={4}>
          <Skeleton className={locals.kpiSkeleton} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Skeleton className={locals.statementSkeleton} />
        </Col>
      </Row>
    </MaxWidthFullscreenContainer>
  );
}
