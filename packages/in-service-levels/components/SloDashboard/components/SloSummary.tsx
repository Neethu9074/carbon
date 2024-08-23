/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { Message } from '@instana/components';
import { t } from '@instana/i18n-react';

import MatchingSloTimeWindowsCard from 'in-service-levels/components/SloDashboard/components/MatchingSloTimeWindowsCard';
import IndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import ErrorBudgetKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/ErrorBudgetKpiCard';
import ErrorBudgetChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetChart';
import SloStatusKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/SloStatusKpiCard';
import TrafficKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/TrafficKpiCard';
import TrafficChart from 'in-service-levels/components/SloDashboard/components/chart/TrafficChart';
import TimeWindowCard from 'in-service-levels/components/SloDashboard/components/TimeWindowCard';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { useSloTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
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

  const { timeWindows, progress } = useSloTimeWindowContext();
  const hasMatchingTimeWindows = timeWindows.length > 0;

  const track = useSloTrackers();
  useEffect(() => {
    const { indicator, timeWindow, entity } = configuration;
    track(SLO_SUMMARY_VIEW, {
      id: configuration.id,
      blueprint: indicator.blueprint,
      indicatorType: indicator.type,
      timeWindowType: timeWindow.type,
      entityType: entity.type
    });
  }, [track, configuration]);
  return (
    <>
      {!progress.loading && !hasMatchingTimeWindows && (
        <Row>
          <Col xs={12}>
            <Message type="warning">{t('in-service-levels:general.noMatchingTimeWindows')}</Message>
          </Col>
        </Row>
      )}
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
          <IndicatorChart
            entity={configuration.entity}
            indicator={configuration.indicator}
            timeWindow={configuration.timeWindow}
            createdDate={configuration.createdDate}
          />
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
