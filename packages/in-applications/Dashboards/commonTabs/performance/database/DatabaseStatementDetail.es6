import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getDatabaseStatement from 'in-subscription/application/getDatabaseStatement';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import { millis, number, percentage } from 'in-services/formatters/number';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Skeleton from 'in-components/Progress/Skeleton';
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
    if (statementResult.progress.loading) {
      return <DashboardSkeleton />;
    } else if (statementResult.errors && statementResult.errors.length > 0) {
      return <ErroneousResultPresenter errors={statementResult.errors} />;
    }
    return renderStatementData(statementResult.data);
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
          <Card title="Statement">{statmentData.statement}</Card>
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
