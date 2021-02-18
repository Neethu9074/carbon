/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { getChartTimeConfigByEvent, getTimeConfigFromEvent } from 'in-events/timeframe';
import ApplicationAlertingChartWithErrorMessage from 'in-applications/alerting/chart/ApplicationAlertingChartWithErrorMessage';
import ReadOnlyInboundOrAllCalls from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import { SmartAlertAffectedEntities } from 'in-events/components/EventContent/SmartAlertAffectedEntities';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import ScopeConfigPresenter from 'in-new-components/Alerting/components/ScopeConfigPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import ApplicationScopePath from 'in-applications/alerting/components/ApplicationScopePath';
import useApplicationEventAlertConfig from 'in-events/hooks/useApplicationEventAlertConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import { Col, Row } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

import locals from './ApplicationEventContent.mless';

export default function ApplicationEventContent({ event }) {
  const alertConfig = useApplicationEventAlertConfig(event);
  const eventEntity = useApplicationEventEntity(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const { tagFilters, tagFilterExpression, rule, convertedTagFilterExpression, boundaryScope } = alertConfig;
  const alertType = rule.alertType;

  const blueprintConfig = getBlueprintConfig(alertType);
  const timeConfig = {
    ...getChartTimeConfigByEvent({ event }),
    windowSize: alertingEventDetailsChartTimeframe
  };
  const analyzeTimeConfig = getSmartAlertAnalyzeTimeframe(event, alertConfig);
  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDetails')}>
            <ApplicationScopePath
              {...eventEntity}
              boundaryScope={boundaryScope}
              timeConfig={getTimeConfigFromEvent(event)}
              showDashboardLinks
            />

            <ProblemDescription event={event} />
            <DescriptionButtons>
              <ApplicationAlertConfigButton alertConfig={alertConfig} />
              <AnalyzeApplicationEventButton
                {...eventEntity}
                alertConfig={alertConfig}
                timeConfig={analyzeTimeConfig}
              />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleMetrics')}>
            <ApplicationAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              serviceId={eventEntity.serviceId}
            />
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleScope')}>
            <div className={locals.alertFiltersWrapper}>
              <ScopeConfigPresenter
                tagFilterList={
                  <TagFilterListPresenter
                    tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                      applicationName: eventEntity.applicationName,
                      tagFilters: [...blueprintConfig.getEntityTagFilters(alertConfig), ...tagFilters]
                    })}
                    disabled
                  />
                }
                tagFilterFormModel={tagFilterFormModel}
                queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
                convertedTagFilterExpression={convertedTagFilterExpression}
                scopePath={<ApplicationScopePath boundaryScope={alertConfig.boundaryScope} {...eventEntity} />}
              />
            </div>
            <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <SmartAlertAffectedEntities {...eventEntity} alertConfig={alertConfig} event={event} />
        </Col>
      </Row>
    </>
  );
}
