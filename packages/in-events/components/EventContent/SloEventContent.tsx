/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Map } from 'immutable';
import React from 'react';

import { isApplicationSloEntity } from '@instana/types';
import { Card } from '@instana/components';

import SloExpandedErrorBudgetChart from 'in-service-levels/components/Shared/SloExpandedErrorBudgetChart';
import TriggeredIncidentButton from 'in-events/components/tabs/Summary/common/TriggeredIncidentButton';
import useSloAlertConfig from 'in-alerting/smart-alerts/slo/hooks/useSloAlertConfig';
import SloScopePath from 'in-alerting/smart-alerts/slo/components/SloScopePath';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import AnalyzeSloEventButton from 'in-events/components/AnalyzeSloEventButton';
import useSloConfiguration from 'in-service-levels/hooks/useSloConfiguration';
import SloAlertConfigButton from 'in-events/components/SloAlertConfigButton';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { Row, Col } from 'in-components/layout/Grid';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

interface SloEventContentProps {
  event: EventOrMap;
  snapshot?: Map<string, unknown>;
}

export default function SloEventContent({ event, snapshot }: SloEventContentProps) {
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityType = event.get('plugin') as string;
  const entityId = event.get('entityId') as string;
  const sloId = event.getIn(['metadata', 'sloId']);
  const sloLabel = event.getIn(['metadata', 'sloLabel']);
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');
  const configId = event.getIn(['metadata', 'eventSpecificationId']);
  const volatileId = snapshot?.get('volatileId') as Map<string, unknown>;

  const timeConfig = getTimeConfigFromEvent(event);
  const [alertConfig] = useSloAlertConfig({ id: configId });
  const [sloConfig] = useSloConfiguration(sloId);

  if (!alertConfig || !sloConfig) return <LoadingIndicator size="xxxl" />;

  const boundaryScope = isApplicationSloEntity(sloConfig.entity) ? sloConfig.entity.boundaryScope : undefined;

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <SloScopePath
              sloId={sloId}
              sloLabel={sloLabel}
              entityType={entityType}
              entityId={entityId}
              entityLabel={entityLabel}
              boundaryScope={boundaryScope}
            />
            <ProblemDescription fixSuggestion={fixSuggestion} />
            <DescriptionButtons>
              <TriggeredIncidentButton event={event} />
              <SloAlertConfigButton sloId={sloConfig.id!} alertConfig={alertConfig} />
              <AnalyzeSloEventButton sloConfig={sloConfig} timeConfig={timeConfig} />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>
      <Row withoutSideMargin>
        <Col xs>
          <SloExpandedErrorBudgetChart
            sloConfig={sloConfig}
            timeConfig={timeConfig}
            title={t('in-service-levels:sloDashboard.components.errorBudgetChart.title')}
          />
        </Col>
      </Row>
      <AutomationCard volatileId={volatileId?.toJS() ?? {}} event={event?.toJS()} />
    </>
  );
}
