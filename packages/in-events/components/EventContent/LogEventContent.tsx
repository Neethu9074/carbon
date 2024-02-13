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
import LogAlertChartWrapper from 'in-alerting/smart-alerts/logs/components/LogAlertChartWrapper';
import { getExpressionWithGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import LogScopePath from 'in-alerting/smart-alerts/logs/components/LogScopePath';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import AnalyzeLogEventButton from 'in-events/components/AnalyzeLogEventButton';
import useLogEventAlertConfig from 'in-events/hooks/useLogEventAlertConfig';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { fixateTimeConfig } from 'in-stores/time/config';
import { emptyMap } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import { deepCopy } from 'in-services/util/object';
import { TagFilterExpression } from 'in-types';
import { EventOrMap } from 'in-events/types';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface Props {
  event: EventOrMap;
}

export default function LogEventContent({ event }: Props) {
  const alertConfig = useLogEventAlertConfig(event);

  if (!alertConfig) {
    return null;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');
  const groupingTags = event.getIn(['metadata', 'groupingTags'], emptyMap).toJS();

  const tagFilterExpression = alertConfig.tagFilterExpression;

  const alertConfigWithGroupingExpression = {
    ...alertConfig,
    tagFilterExpression: {
      ...getExpressionWithGroupingTags(deepCopy(tagFilterExpression) as TagFilterExpression, groupingTags)
    }
  };

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
    </>
  );
}

function getAnalyzeTimeConfig(event: EventOrMap) {
  const eventTimeConfig = getTimeConfigFromEvent(event);
  return fixateTimeConfig(eventTimeConfig);
}
