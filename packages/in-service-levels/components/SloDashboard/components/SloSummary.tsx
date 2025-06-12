/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { Message } from '@instana/components';

import MatchingSloTimeWindowsCard from 'in-service-levels/components/SloDashboard/components/MatchingSloTimeWindowsCard';
import IndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import ErrorBudgetKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/ErrorBudgetKpiCard';
import ErrorBudgetChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetChart';
import SloStatusKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/SloStatusKpiCard';
import BurnRateKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/BurnRateKpiCard';
import BurnRateChart from 'in-service-levels/components/SloDashboard/components/chart/BurnRateChart';
import TrafficKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/TrafficKpiCard';
import TrafficChart from 'in-service-levels/components/SloDashboard/components/chart/TrafficChart';
import TimeWindowCard from 'in-service-levels/components/SloDashboard/components/TimeWindowCard';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { SLO_SUMMARY_VIEW } from 'in-services/tracking/eventNames';
import { sloBurnRateEnabled } from 'in-services/featureFlags';
import { Col, Row } from 'in-components/layout/Grid';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

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

  const { trackCta } = useSegmentTracking();

  useEffect(() => {
    const { indicator, timeWindow, entity } = configuration;
    trackCta(SLO_SUMMARY_VIEW, {
      id: configuration.id,
      blueprint: indicator.blueprint,
      indicatorType: indicator.type,
      timeWindowType: timeWindow.type,
      entityType: entity.type
    });
  }, [trackCta, configuration]);
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
      {sloBurnRateEnabled ? (
        <>
          <Row>
            <Col xs={3}>
              <SloStatusKpiCard configuration={configuration} />
            </Col>
            <Col xs={3}>
              <ErrorBudgetKpiCard configuration={configuration} />
            </Col>
            <Col xs={3}>
              <BurnRateKpiCard configuration={configuration} />
            </Col>
            <Col xs={3}>
              <TrafficKpiCard configuration={configuration} />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <IndicatorChart
                customHeight={250}
                configuration={configuration}
                customChartSkeletonHeight={332}
                entity={configuration.entity}
                indicator={configuration.indicator}
                createdDate={configuration.createdDate}
                title={t('in-service-levels:sloDashboard.components.indicatorChart.title')}
              />
            </Col>

            <Col lg={6}>
              <ErrorBudgetChart
                customHeight={250}
                customChartSkeletonHeight={332}
                configuration={configuration}
                title={t('in-service-levels:sloDashboard.components.errorBudgetChart.title')}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <BurnRateChart
                customHeight={250}
                customChartSkeletonHeight={332}
                configuration={configuration}
                title={t('in-service-levels:sloDashboard.components.burnRateChart.title')}
              />
            </Col>
            <Col lg={6}>
              <TrafficChart customHeight={250} customChartSkeletonHeight={332} configuration={configuration} />
            </Col>
          </Row>
        </>
      ) : (
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
              <IndicatorChart
                customHeight={250}
                configuration={configuration}
                customChartSkeletonHeight={332}
                entity={configuration.entity}
                indicator={configuration.indicator}
                createdDate={configuration.createdDate}
                title={t('in-service-levels:sloDashboard.components.indicatorChart.title')}
              />
            </Col>
            <Col lg={4}>
              <ErrorBudgetChart
                customHeight={250}
                customChartSkeletonHeight={332}
                configuration={configuration}
                title={t('in-service-levels:sloDashboard.components.errorBudgetChart.title')}
              />
            </Col>
            <Col lg={4}>
              <TrafficChart customHeight={250} customChartSkeletonHeight={332} configuration={configuration} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
