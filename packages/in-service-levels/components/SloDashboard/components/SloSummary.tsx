/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// eslint-disable-next-line no-restricted-imports
import { ActionableNotification } from '@carbon/react';
import React, { useEffect, useState } from 'react';

import { Grid, Column } from '@instana/carbon';
import { Message } from '@instana/components';

import MatchingSloTimeWindowsCard from 'in-service-levels/components/SloDashboard/components/MatchingSloTimeWindowsCard';
import IndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import { buildTimezoneFromLocationName, getCurrentFormattedTimezone } from 'in-service-levels/utils/timezone';
import ErrorBudgetKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/ErrorBudgetKpiCard';
import ErrorBudgetChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetChart';
import SloStatusKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/SloStatusKpiCard';
import BurnRateKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/BurnRateKpiCard';
import BurnRateChart from 'in-service-levels/components/SloDashboard/components/chart/BurnRateChart';
import TrafficKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/TrafficKpiCard';
import TrafficChart from 'in-service-levels/components/SloDashboard/components/chart/TrafficChart';
import TimeWindowCard from 'in-service-levels/components/SloDashboard/components/TimeWindowCard';
import ConfigureSloDialog from 'in-service-levels/components/ConfigDialog/ConfigureSloDialog';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import type { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { SLO_SUMMARY_VIEW } from 'in-services/tracking/eventNames';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { utcLabel } from 'in-service-levels/constants';
import type { Nullish } from 'in-types';
import { t } from 'in-i18n';

import locals from './SloSummary.mless';

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
  const meta = { productArea: productAreas.slo, pageName: pageNames.service_levels };

  const { configuration } = data;

  const { timeWindows, progress } = useSloTimeWindowContext();
  const hasMatchingTimeWindows = timeWindows.length > 0;

  const [isNotificationVisible, setNotificationVisible] = useState(true);
  const { timeWindow } = configuration;
  const sloTimezone = timeWindow?.timezone || utcLabel;
  const isTimezoneBound = sloTimezone && sloTimezone !== utcLabel;
  const isTimezoneMismatch = buildTimezoneFromLocationName(sloTimezone) !== getCurrentFormattedTimezone();
  const showTimezoneNotification = isTimezoneBound && isTimezoneMismatch && isNotificationVisible;

  const { trackCta } = useSegmentTracking();

  const openEditDialog = () => {
    addActiveDialog(<ConfigureSloDialog mode="EDIT" configuration={configuration} trackingMeta={meta} />);
  };

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
    <Grid fullWidth className={locals.sloSummaryItemRow}>
      {!progress.loading && !hasMatchingTimeWindows && (
        <Column span="100%">
          <Message fullInlineWidth type="warning">
            {t('in-service-levels:general.noMatchingTimeWindows')}
          </Message>
        </Column>
      )}
      {showTimezoneNotification && (
        <Column span="100%" className={locals.toastContainer}>
          <ActionableNotification
            inline
            actionButtonLabel={t('in-service-levels:sloChart.sloChartSummary.editSloTimezone')}
            onActionButtonClick={openEditDialog}
            onCloseButtonClick={() => setNotificationVisible(false)}
            kind="info"
            lowContrast
            title={t('in-service-levels:sloChart.sloChartSummary.sloCreatedTimezone', { sloTimezone })}
            subtitle={t('in-service-levels:sloChart.sloChartSummary.currentTimezone', {
              timezone: getCurrentFormattedTimezone()
            })}
          />
        </Column>
      )}

      <Column sm={4} lg={8}>
        <TimeWindowCard configuration={configuration} />
      </Column>
      <Column sm={4} lg={8}>
        <MatchingSloTimeWindowsCard />
      </Column>
      <Column xs={4} md={4} lg={4}>
        <SloStatusKpiCard configuration={configuration} />
      </Column>
      <Column xs={4} md={4} lg={4}>
        <ErrorBudgetKpiCard configuration={configuration} />
      </Column>
      <Column xs={4} md={4} lg={4}>
        <BurnRateKpiCard configuration={configuration} />
      </Column>
      <Column xs={4} md={4} lg={4}>
        <TrafficKpiCard configuration={configuration} />
      </Column>
      <Column sm={4} lg={8}>
        <IndicatorChart
          customHeight={250}
          configuration={configuration}
          customChartSkeletonHeight={325}
          entity={configuration.entity}
          indicator={configuration.indicator}
          createdDate={configuration.createdDate}
          title={t('in-service-levels:sloDashboard.components.indicatorChart.title')}
        />
      </Column>

      <Column sm={4} lg={8}>
        <ErrorBudgetChart
          customHeight={250}
          customChartSkeletonHeight={325}
          configuration={configuration}
          title={t('in-service-levels:sloDashboard.components.errorBudgetChart.title')}
        />
      </Column>
      <Column sm={4} lg={8}>
        <BurnRateChart
          customHeight={250}
          customChartSkeletonHeight={325}
          configuration={configuration}
          title={t('in-service-levels:sloDashboard.components.burnRateChart.title')}
        />
      </Column>
      <Column sm={4} lg={8}>
        <TrafficChart customHeight={250} customChartSkeletonHeight={325} configuration={configuration} />
      </Column>
    </Grid>
  );
}
