/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';
import React from 'react';

import { Card } from '@instana/components';

import {
  alertingDialogItemPickerTimeframe as maxDurationMillis,
  alertingEventDetailsChartTimeframe as minDurationMillis
} from 'in-alerting/components/constants';
import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import TriggeredIncidentButton from 'in-events/components/tabs/Summary/common/TriggeredIncidentButton';
import { getExpressionWithLogsGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import LogAlertChartWrapper from 'in-alerting/smart-alerts/logs/components/LogAlertChartWrapper';
import { TagFilterExpression, TimeConfig, TagCatalog, GroupTagInfo, Nullish } from 'in-types';
import ManualCloseIssueButton from 'in-events/components/tabs/Summary/ManualCloseIssueButton';
import { ScopeGroupingTags } from 'in-events/components/EventContent/ScopeLogsGroupingTags';
import { hasManualCloseFields, getEventStateBadge } from 'in-events/components/eventUtil';
import ManualCloseDescription from 'in-events/components/legacy/ManualCloseDescription';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import LogScopePath from 'in-alerting/smart-alerts/logs/components/LogScopePath';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import AnalyzeLogEventButton from 'in-events/components/AnalyzeLogEventButton';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import LogAlertConfigButton from 'in-events/components/LogAlertConfigButton';
import useLogEventAlertConfig from 'in-events/hooks/useLogEventAlertConfig';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { manuallyCloseEventEnabled } from 'in-services/featureFlags';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import { fixateTimeConfig } from 'in-stores/time/config';
import EventIcon from 'in-events/components/EventIcon';
import { emptyMap } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import { deepCopy } from 'in-services/util/object';
import { EventOrMap } from 'in-events/types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

interface Props {
  event: EventOrMap;
  snapshot: Map<string, unknown>;
  reload: () => void;
}

export default function LogEventContent({ event, snapshot, reload }: Props) {
  const alertConfig = useLogEventAlertConfig(event);
  const tagCatalog = useTagCatalog('SMART_ALERTS');

  if (!alertConfig || !tagCatalog) {
    return <LoadingIndicator size="xxxl" />;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');
  const groupingTags = event.getIn(['metadata', 'groupingTags'], emptyMap).toJS();

  const groups =
    groupingTags?.length > 0 &&
    groupingTags?.map((grouping: GroupTagInfo) => {
      return {
        groupbyTag: grouping.tagName,
        groupbyTagEntity: NOT_APPLICABLE,
        groupbyTagSecondLevelKey: grouping?.key,
        groupbyValue: grouping?.value
      };
    });

  const tagFilterExpression = alertConfig.tagFilterExpression;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  const alertConfigWithGroupingExpression = {
    ...alertConfig,
    tagFilterExpression: {
      ...getExpressionWithLogsGroupingTags(deepCopy(tagFilterExpression) as TagFilterExpression, groups ?? [])
    }
  };
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  const windowSize = getWindowSizeFromEvent(event, minDurationMillis, maxDurationMillis);

  const granularity = alertConfig.granularity;
  const endTime = (event.get('state') as string) === 'closed' ? (event.get('end') as number) : null;

  let timeConfig = {
    ...getChartTimeConfigByEvent(event),
    to: roundToNearest(endTime, granularity),
    autoRefresh: false,
    ...(windowSize && { windowSize })
  } as TimeConfig;

  const canCloseManually = manuallyCloseEventEnabled && role?.canManuallyCloseIssue;
  const pillContent = getEventStateBadge(event);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')} leftHeaderContent={pillContent}>
            <LogScopePath entityLabel={entityLabel} />

            <ProblemDescription fixSuggestion={fixSuggestion} />
            {canCloseManually && hasManualCloseFields(event) ? (
              <div>
                <ManualCloseDescription event={event} />
                <DescriptionButtons>
                  <TriggeredIncidentButton event={event} />
                  <LogAlertConfigButton alertConfig={alertConfig} />
                  <AnalyzeLogEventButton
                    alertConfig={alertConfigWithGroupingExpression}
                    timeConfig={getAnalyzeTimeConfig(event as EventOrMap)}
                  />
                </DescriptionButtons>
              </div>
            ) : (
              <DescriptionButtons>
                {canCloseManually && (
                  <ManualCloseIssueButton
                    event={event}
                    reload={reload}
                    iconComponent={
                      <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />
                    }
                  />
                )}
                <TriggeredIncidentButton event={event} />
                <LogAlertConfigButton alertConfig={alertConfig} />
                <AnalyzeLogEventButton
                  alertConfig={alertConfigWithGroupingExpression}
                  timeConfig={getAnalyzeTimeConfig(event as EventOrMap)}
                />
              </DescriptionButtons>
            )}
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleMetrics')}>
            <LogAlertChartWrapper alertConfig={alertConfigWithGroupingExpression} timeConfig={timeConfig} />
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleScope')}>
            <ScopeConfigPresenter
              tagFilterFormModel={tagFilterFormModel}
              //@ts-expect-error type error for querybuilder
              queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
              scopePath={
                <>
                  <LogScopePath entityLabel={entityLabel} />
                  <ScopeGroupingTags AlertQueryBuilder={AlertQueryBuilder} groupingTags={groups} />{' '}
                </>
              }
            />
          </Card>
        </Col>
      </Row>
      <AutomationCard
        volatileId={(snapshot?.get('volatileId') as Map<string, unknown>)?.toJS() ?? {}}
        event={event?.toJS()}
      />
    </>
  );
}

function getAnalyzeTimeConfig(event: EventOrMap) {
  const eventTimeConfig = getTimeConfigFromEvent(event);
  return fixateTimeConfig(eventTimeConfig);
}

function roundToNearest(endTime: number | Nullish, granularity: number) {
  if (!endTime) {
    return null;
  }
  return Math.round((endTime + granularity) / granularity) * granularity;
}
