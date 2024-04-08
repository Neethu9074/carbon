/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Card } from '@instana/components';

import SloScopePath from 'in-alerting/smart-alerts/slo/components/SloScopePath';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { Row, Col } from 'in-components/layout/Grid';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

interface Props {
  event: EventOrMap;
}

export default function SloEventContent({ event }: Props) {
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityType = event.get('plugin') as string;
  const entityId = event.get('entityId') as string;
  const sloId = event.getIn(['metadata', 'sloId']);
  const sloLabel = event.getIn(['metadata', 'sloLabel']);
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            {/* TODO for Team SLO: pass boundary scope in case of AP SLO from SLO config, once fetched here, which might later anyways be needed to show the chart */}
            <SloScopePath
              sloId={sloId}
              sloLabel={sloLabel}
              entityType={entityType}
              entityId={entityId}
              entityLabel={entityLabel}
            />

            <ProblemDescription fixSuggestion={fixSuggestion} className="in-event-view-event-content" />
          </Card>
        </Col>
      </Row>
    </>
  );
}
