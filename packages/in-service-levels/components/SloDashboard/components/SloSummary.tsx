/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ErrorBudgetConsumptionChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetConsumptionChart';
import IndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import ErrorBudgetKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/ErrorBudgetKpiCard';
import ErrorBudgetChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetChart';
import SloStatusKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/SloStatusKpiCard';
import TrafficKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/TrafficKpiCard';
import TrafficChart from 'in-service-levels/components/SloDashboard/components/chart/TrafficChart';
import useSloWindowTimeConfig from 'in-service-levels/hooks/useSloWindowTimeConfig';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
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
        <Col xs={4}>
          <SloStatusKpiCard configuration={configuration} timeConfig={fullWindowTimeConfig} />
        </Col>
        <Col xs={4}>
          <ErrorBudgetKpiCard configuration={configuration} timeConfig={fullWindowTimeConfig} />
        </Col>
        <Col xs={4}>
          <TrafficKpiCard configuration={configuration} timeConfig={selectedTimeConfig} />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <IndicatorChart
            indicator={configuration.indicator}
            entity={configuration.entity}
            timeConfig={selectedTimeConfig}
          />
        </Col>
        <Col lg={4}>
          <ErrorBudgetChart configuration={configuration} timeConfig={selectedTimeConfig} />
        </Col>
        <Col lg={4}>
          <TrafficChart configuration={configuration} timeConfig={selectedTimeConfig} />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <ErrorBudgetChart configuration={configuration} timeConfig={selectedTimeConfig} showFullSloTimeWindow />
        </Col>
        <Col lg>
          <ErrorBudgetConsumptionChart configuration={configuration} timeConfig={fullWindowTimeConfig} />
        </Col>
      </Row>
    </>
  );
}
