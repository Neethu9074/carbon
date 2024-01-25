/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import IndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import ErrorBudgetKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/ErrorBudgetKpiCard';
import ErrorBudgetChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetChart';
import SloStatusKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/SloStatusKpiCard';
import TrafficKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/TrafficKpiCard';
import TrafficChart from 'in-service-levels/components/SloDashboard/components/chart/TrafficChart';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { Col, Row } from 'in-components/layout/Grid';
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

  return (
    <>
      <Row>
        <Col xs={4}>
          <SloStatusKpiCard configuration={configuration} />
        </Col>
        <Col xs={4}>
          <ErrorBudgetKpiCard configuration={configuration} />
        </Col>
        <Col xs={4}>
          <TrafficKpiCard configuration={configuration} />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <IndicatorChart indicator={configuration.indicator} entity={configuration.entity} />
        </Col>
        <Col lg={4}>
          <ErrorBudgetChart configuration={configuration} />
        </Col>
        <Col lg={4}>
          <TrafficChart configuration={configuration} />
        </Col>
      </Row>
    </>
  );
}
