/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

import RecommendedActionsCard from './RecommendedActionsCard';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import AssociatedActions from './AssociatedActionsCard';
import { Event, VolatileId } from 'in-types';
import { t } from 'in-i18n';

interface AssociatedAndRecommendedActionsProps {
  volatileId: VolatileId;
  event: Event;
  associatedActionsTitle?: string;
}

export default function AssociatedAndRecommendedActions({
  volatileId,
  event,
  associatedActionsTitle
}: AssociatedAndRecommendedActionsProps) {
  const [reload, setReload] = useState(0);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card>
            <AssociatedActions
              title={associatedActionsTitle}
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
          <Card title={t('in-automation:recommendedActions')} leftHeaderContent={<BetaBadge />}>
            <RecommendedActionsCard volatileId={volatileId} event={event} reload={reload} setReload={setReload} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
