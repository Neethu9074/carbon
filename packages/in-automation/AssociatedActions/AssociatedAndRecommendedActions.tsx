/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import RecommendedActionsCard from './RecommendedActionsCard';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import AssociatedActions from './AssociatedActionsCard';
import { Event, VolatileId } from 'in-types';

interface AssociatedAndRecommendedActionsProps {
  volatileId: VolatileId;
  event: Event;
}

export default function AssociatedAndRecommendedActions({ volatileId, event }: AssociatedAndRecommendedActionsProps) {
  const [reload, setReload] = useState(0);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card>
            <AssociatedActions
              title={t('in-events:actionsAssociatedForTriggeringEvent')}
              volatileId={volatileId}
              event={event}
              reload={reload}
              setReload={setReload}
            />
          </Card>
        </Col>
      </Row>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:recommendedActions')}>
            <RecommendedActionsCard volatileId={volatileId} event={event} reload={reload} setReload={setReload} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
