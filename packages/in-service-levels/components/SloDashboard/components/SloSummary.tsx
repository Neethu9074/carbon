/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ErrorBudgetKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/ErrorBudgetKpiCard';
import ErrorBudgetChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetChart';
import SloStatusKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/SloStatusKpiCard';
import useSloWindowTimeConfig from 'in-service-levels/hooks/useSloWindowTimeConfig';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import ResultAwareKpiCard from 'in-components/KpiCard/ResultAwareKpiCard';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { pendingResult } from 'in-services/fixedObjects';
import { Col, Row } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Nullish } from 'in-types';

interface SloSummaryProps {
  data: SloTabData;
}
interface SloSummaryWrapperProps {
  data: SloTabData | Nullish;
}

export default function SloSummary({ data }: SloSummaryWrapperProps) {
  if (!data) {
    return null;
  }
  return <SloSummaryContent data={data} />;
}

function SloSummaryContent({ data }: Required<SloSummaryProps>) {
  const { configuration } = data;
  const { timeWindow } = configuration;
  const fullWindowTimeConfig = useSloWindowTimeConfig(timeWindow);
  const selectedTimeConfig = useTimeConfig();

  // TODO: Rows need to automatically size instead of relying on a fixed chart height
  return (
    <>
      <Row>
        <Col xs>
          <SloStatusKpiCard configuration={configuration} timeConfig={fullWindowTimeConfig} />
        </Col>
        <Col xs>
          <ErrorBudgetKpiCard configuration={configuration} timeConfig={fullWindowTimeConfig} />
        </Col>
        <Col xs>
          <PlaceholderLoadingKpiCard />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <PlaceholderLoadingChart />
        </Col>
        <Col lg={4}>
          <ErrorBudgetChart configuration={configuration} timeConfig={selectedTimeConfig} />
        </Col>
        <Col lg={4}>
          <PlaceholderLoadingChart />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <ErrorBudgetChart configuration={configuration} timeConfig={selectedTimeConfig} showFullSloTimeWindow />
        </Col>
      </Row>
    </>
  );
}

function PlaceholderLoadingKpiCard() {
  return <ResultAwareKpiCard title="placeholder" result={pendingResult} renderKpiCard={() => <div />} />;
}

function PlaceholderLoadingChart() {
  const timeConfig = useTimeConfig();
  return (
    <ResultAwareChart
      result={pendingResult}
      config={{
        title: 'placeholder',
        y1: { metrics: [], colors: [], renderer: Renderer.line, metricIds: [], labels: [] },
        timeConfig,
        customChartSkeletonHeight: 182
      }}
    />
  );
}
