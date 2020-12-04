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
import WithQB1orQB2 from 'in-new-components/Alerting/components/WithQB1orQB2';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import { Col, Row } from 'in-new-components/layout/Grid';
import useObservable from 'in-hooks/useObservable';
import Stack from 'in-new-components/layout/Stack';
import HelpText from 'in-components/form/HelpText';
import Card from 'in-new-components/Card';

import locals from './ApplicationEventContent.mless';

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
                tagFilterExpression: fromBackendModel(tagFilterExpression ?? [])
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
            <Stack space="xsmall">
              <HelpText className={locals.helpTextNoTopSpace}>Application Perspective</HelpText>
              <IconLabel text={applicationName} type="lib_application" />
              {(tagFilterExpression.length > 0 || tagFilters.length > 0) && <HelpText>Additional Filters</HelpText>}
              <WithQB1orQB2
                onUsesQB1={() => (
                  <TagFilterListPresenter
                    tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                      applicationName,
                      tagFilters: [blueprintConfig.getEntityTagFilter(alertConfig), ...tagFilters]
                    })}
                    disabled
                  />
                )}
                onUsesQB2={() => <AlertQueryBuilder value={fromBackendModel(tagFilterExpression)} readOnly />}
                shouldFallbackToQB2={isQB2Config => isQB2Config(convertedTagFilterExpression)}
              />
            </Stack>
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
