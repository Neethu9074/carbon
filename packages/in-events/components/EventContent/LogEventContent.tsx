/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card } from '@instana/components';

import {
  alertingDialogItemPickerTimeframe as maxDurationMillis,
  alertingEventDetailsChartTimeframe as minDurationMillis
} from 'in-alerting/components/constants';
import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import LogAlertChartWrapper from 'in-alerting/smart-alerts/logs/components/LogAlertChartWrapper';
import { getExpressionWithGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import { ScopeGroupingTags } from 'in-events/components/EventContent/ScopeGroupingTags';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import LogScopePath from 'in-alerting/smart-alerts/logs/components/LogScopePath';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import AnalyzeLogEventButton from 'in-events/components/AnalyzeLogEventButton';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import useLogEventAlertConfig from 'in-events/hooks/useLogEventAlertConfig';
import { TagFilterExpression, TimeConfig, TagCatalog } from 'in-types';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import { fixateTimeConfig } from 'in-stores/time/config';
import { emptyMap } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import { deepCopy } from 'in-services/util/object';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

interface Props {
  event: EventOrMap;
}

export default function LogEventContent({ event }: Props) {
  const alertConfig = useLogEventAlertConfig(event);
  const tagCatalog = useTagCatalog('SMART_ALERTS');

  if (!alertConfig || !tagCatalog) {
    return null;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');
  const groupingTags = event.getIn(['metadata', 'groupingTags'], emptyMap).toJS();

  const tagFilterExpression = alertConfig.tagFilterExpression;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  const alertConfigWithGroupingExpression = {
    ...alertConfig,
    tagFilterExpression: {
      ...getExpressionWithGroupingTags(deepCopy(tagFilterExpression) as TagFilterExpression, groupingTags)
    }
  };
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  const windowSize = getWindowSizeFromEvent(event, minDurationMillis, maxDurationMillis);

  let timeConfig = {
    ...getChartTimeConfigByEvent(event),
    autoRefresh: false,
    ...(windowSize && { windowSize })
  } as TimeConfig;

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <LogScopePath entityLabel={entityLabel} />

            <ProblemDescription fixSuggestion={fixSuggestion} className="in-event-view-event-content" />

            <DescriptionButtons>
              <AnalyzeLogEventButton
                alertConfig={alertConfigWithGroupingExpression}
                timeConfig={getAnalyzeTimeConfig(event as EventOrMap)}
              />
            </DescriptionButtons>
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
                  <ScopeGroupingTags AlertQueryBuilder={AlertQueryBuilder} groupingTags={groupingTags} />{' '}
                </>
              }
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

function getAnalyzeTimeConfig(event: EventOrMap) {
  const eventTimeConfig = getTimeConfigFromEvent(event);
  return fixateTimeConfig(eventTimeConfig);
}
