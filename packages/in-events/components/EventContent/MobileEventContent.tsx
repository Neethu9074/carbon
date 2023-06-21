/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

//@ts-expect-error needs TS migration
import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { HighlightDataRetention } from 'in-events/components/EventContent/HighlightDataRetention';
import MobileAppScopePath from 'in-alerting/smart-alerts/mobileApp/components/MobileAppScopePath';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import AnalyzeMobileAppEventButton from 'in-events/components/AnalyzeMobileAppEventButton';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import useMobileAppEventAlertConfig from 'in-events/hooks/useMobileAppEventAlertConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import { isApproximatePrecision } from 'in-events/components/util/metricResultUtil';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import useMobileAppEventEntity from 'in-events/hooks/useMobileAppEventEntity';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { Row, Col } from 'in-components/layout/Grid';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/EventContent/MobileEventContent.mless';

interface Props {
  event: EventOrMap;
}

export default function MobileEventContent({ event }: Props) {
  const eventEntity = useMobileAppEventEntity(event);
  const alertConfig = useMobileAppEventAlertConfig(event);
  const [metricResultPrecision, setMetricResultPrecision] = useState<string>('');
  if (!eventEntity || !alertConfig) {
    return null;
  }
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const { tagFilterExpression, rule } = alertConfig;
  const { alertType, metricName } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);
  const AlertQueryBuilder = getQueryBuilderForBeaconType(beaconType).QueryBuilder;
  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    autoRefresh: false,
    windowSize: alertingEventDetailsChartTimeframe
  };
  const chartViewConfig = createDefaultChartConfig(timeConfig);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <MobileAppScopePath {...eventEntity} showDashboardLinks />

            <ProblemDescription fixSuggestion={fixSuggestion} className="in-event-view-event-content" />
            <DescriptionButtons>
              <AnalyzeMobileAppEventButton
                mobileAppName={eventEntity.mobileAppName}
                alertConfig={alertConfig}
                timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
              />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>
      <Row withoutSideMargin>
        <Col xs>
          <Card
            title={t('in-events:titleMetrics')}
            leftHeaderContent={
              <HighlightDataRetention hasApproximateData={isApproximatePrecision(metricResultPrecision)} />
            }
          >
            <MobileAppAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              setMetricResultPrecision={setMetricResultPrecision}
              isEventsView
            />
          </Card>
        </Col>
      </Row>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleScope')}>
            <div className={locals.alertFiltersWrapper}>
              <ScopeConfigPresenter
                tagFilterFormModel={tagFilterFormModel}
                //@ts-expect-error type error for querybuilder
                queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
                scopePath={<MobileAppScopePath {...eventEntity} />}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
