/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  getChartTimeConfigByEvent,
  getTimeConfigFromEventForSnapshotRetrieval,
  getTimeConfigFromEvent
} from 'in-events/timeframe';
import ApplicationAlertingChartWithErrorMessage from 'in-applications/alerting/chart/ApplicationAlertingChartWithErrorMessage';
import ReadOnlyInboundOrAllCalls from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import { SmartAlertAffectedEntities } from 'in-events/components/EventContent/SmartAlertAffectedEntities';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import ScopeConfigPresenter from 'in-new-components/Alerting/components/ScopeConfigPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import EntityInformation from 'in-events/components/EntityInformation/EntityInformation';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import useAppDataEventEntity from 'in-events/hooks/useAppDataEventEntity';
import useEventAlertConfig from 'in-events/hooks/useEventAlertConfig';
import { getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import { Col, Row } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

import locals from './ApplicationEventContent.mless';

export default function ApplicationEventContent({ event }) {
  const alertConfig = useEventAlertConfig(event);
  const eventEntity = useAppDataEventEntity(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const entityId = event.get('entityId');
  const entityType = event.get('entityType');
  const metadata = event.get('metadata');

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
  // TODO add service-scope filter to the expression ... this one is then needed for the chart and the affected-entities

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title="Description">
            <EntityInformation
              entityId={entityId}
              entityType={entityType}
              metadata={metadata}
              timeConfig={getTimeConfigFromEventForSnapshotRetrieval(event)}
              linkTimeConfig={getTimeConfigFromEvent(event)}
              boundaryScope={boundaryScope}
            />

            <ProblemDescription event={event} className="in-event-view-event-content" />
            <DescriptionButtons>
              <ApplicationAlertConfigButton alertConfig={alertConfig} />
              <AnalyzeApplicationEventButton
                alertConfig={alertConfig}
                applicationName={eventEntity.applicationName}
                timeConfig={analyzeTimeConfig}
              />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title="Metrics">
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
          <Card title="Scope">
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
                scopePath={{
                  applicationName: eventEntity.applicationName,
                  serviceName: eventEntity.serviceName
                }}
              />
            </div>
            <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <SmartAlertAffectedEntities alertConfig={alertConfig} event={event} />
        </Col>
      </Row>
    </>
  );
}
