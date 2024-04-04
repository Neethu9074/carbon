/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext, useEffect } from 'react';

import MatchingSloTimeWindowsCard from 'in-service-levels/components/SloDashboard/components/MatchingSloTimeWindowsCard';
import IndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import ErrorBudgetKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/ErrorBudgetKpiCard';
import ErrorBudgetChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetChart';
import SloStatusKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/SloStatusKpiCard';
import TrafficKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/TrafficKpiCard';
import TrafficChart from 'in-service-levels/components/SloDashboard/components/chart/TrafficChart';
import TimeWindowCard from 'in-service-levels/components/SloDashboard/components/TimeWindowCard';
import { trackerContext, useSloTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { SLO_SUMMARY_VIEW } from 'in-services/tracking/eventNames';
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
  const { meta } = useContext(trackerContext);

  const track = useSloTrackers();
  useEffect(() => {
    const { indicator, timeWindow, entity } = configuration;
    track(SLO_SUMMARY_VIEW, {
      id: configuration.id,
      blueprint: indicator.blueprint,
      indicatorType: indicator.type,
      timeWindowType: timeWindow.type,
      entityType: entity.type,
      productArea: meta.productArea,
      pageName: meta.pageName
    });
  }, [track, configuration, meta]);
  return (
    <>
      <Row>
        <Col xs={6}>
          <TimeWindowCard configuration={configuration} />
        </Col>
        <Col xs={6}>
          <MatchingSloTimeWindowsCard />
        </Col>
      </Row>
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
