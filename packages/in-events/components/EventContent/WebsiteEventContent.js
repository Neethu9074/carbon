/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

import {
  alertingEventDetailsChartTimeframe as minDurationMillis,
  alertingDialogItemPickerTimeframe as maxDurationMillis
} from 'in-alerting/components/constants';
import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { HighlightDataRetention } from 'in-events/components/EventContent/HighlightDataRetention';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import useWebsiteEventAlertConfig from 'in-events/hooks/useWebsiteEventAlertConfig';
import { isApproximatePrecision } from 'in-events/components/util/metricResultUtil';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import { emptyMap } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from 'in-events/components/EventContent/WebsiteEventContent.mless';

export default function WebsiteEventContent({ event }) {
  const eventEntity = useWebsiteEventEntity(event);
  const alertConfig = useWebsiteEventAlertConfig(event);
  const [metricResultPrecision, setMetricResultPrecision] = useState();

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const adaptiveBaselineInfo = event.getIn(['metadata', 'adaptiveBaselineInfo'], emptyMap).toJS();

  const { tagFilterExpression, rule } = alertConfig;
  const { alertType, metricName } = rule;

  const windowSize = getWindowSizeFromEvent(event, minDurationMillis, maxDurationMillis);

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const AlertQueryBuilder = getQueryBuilderForBeaconType(beaconType).QueryBuilder;

  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    autoRefresh: false,
    ...(windowSize && { windowSize })
  };

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <WebsiteScopePath {...eventEntity} timeConfig={getTimeConfigFromEvent(event)} showDashboardLinks />

            <ProblemDescription fixSuggestion={fixSuggestion} className="in-event-view-event-content" />
            <DescriptionButtons>
              <WebsiteAlertConfigButton alertConfig={alertConfig} />
              <AnalyzeWebsiteEventButton
                websiteName={eventEntity.websiteName}
                alertConfig={alertConfig}
                timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
                adaptiveBaselineInfo={adaptiveBaselineInfo}
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
            <WebsitesAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              eventBasedAdaptiveBaseline={Object.entries(adaptiveBaselineInfo).sort((a, b) => a[0] - b[0])}
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
                queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
                scopePath={<WebsiteScopePath {...eventEntity} />}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
