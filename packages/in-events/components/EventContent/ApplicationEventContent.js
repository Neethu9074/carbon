import React from 'react';

import {
  getChartTimeConfigByEvent,
  getTimeConfigFromEventForSnapshotRetrieval,
  getTimeConfigFromEvent
} from 'in-events/timeframe';
import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import { SmartAlertAffectedEntities } from 'in-events/components/EventContent/SmartAlertAffectedEntities';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import ScopeConfigPresenter from 'in-new-components/Alerting/components/ScopeConfigPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import EntityInformation from 'in-events/components/EntityInformation/EntityInformation';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { Col, Row } from 'in-new-components/layout/Grid';
import useObservable from 'in-hooks/useObservable';
import Card from 'in-new-components/Card';

export default function ApplicationEventContent({ event }) {
  const alertConfig = useObservable(
    ([event]) => {
      if (!event) {
        return;
      }
      const configId = event.getIn(['metadata', 'eventSpecificationId']);
      const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
      return getAlertConfigByIdAndTimestamp(configId, configTimestamp);
    },
    [event]
  );

  if (!alertConfig) {
    return null;
  }

  const entityId = event.get('entityId');
  const entityType = event.get('entityType');
  const metadata = event.get('metadata');
  const applicationName = metadata.get('entityLabel');
  const { tagFilters, tagFilterExpression, rule, convertedTagFilterExpression, boundaryScope } = alertConfig;
  const alertType = rule.alertType;

  const blueprintConfig = getBlueprintConfig(alertType);
  const timeConfig = {
    ...getChartTimeConfigByEvent({ event }),
    windowSize: alertingEventDetailsChartTimeframe
  };
  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const tagFilterExpressionUiModel = fromBackendModel(tagFilterExpression);

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
              <AnalyzeApplicationEventButton event={event} alertConfig={alertConfig} />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title="Metrics">
            <AlertingChartWithErrorMessage
              alertConfig={{
                ...alertConfig,
                tagFilterExpression: tagFilterExpressionUiModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
            />
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title="Scope">
            <ScopeConfigPresenter
              tagFilterList={
                <TagFilterListPresenter
                  tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                    applicationName,
                    tagFilters: [blueprintConfig.getEntityTagFilter(alertConfig), ...tagFilters]
                  })}
                  disabled
                />
              }
              tagFilterExpressionUiModel={tagFilterExpressionUiModel}
              queryBuilder={<AlertQueryBuilder value={tagFilterExpressionUiModel} readOnly />}
              convertedTagFilterExpression={convertedTagFilterExpression}
              iconLabelConfig={{
                text: applicationName,
                type: 'lib_application'
              }}
            />
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
