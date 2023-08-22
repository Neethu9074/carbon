/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import { ApplicationAlertConfigWithMetadata, Event, VolatileId } from 'in-types';
import RecommendedActionsCardAlerts from './RecommendedActionsCardAlerts';
import AssociatedActionsAlerts from './AssociatedActionsAlerts';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';

interface AssociatedAndRecommendedActionsAlertsProps {
  volatileId: VolatileId;
  event: Event;
  alertConfig?: ApplicationAlertConfigWithMetadata;
}

export default function AssociatedAndRecommendedActionsAlerts({
  volatileId,
  event,
  alertConfig
}: AssociatedAndRecommendedActionsAlertsProps) {
  const [reload, setReload] = useState(0);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card>
            <AssociatedActionsAlerts
              volatileId={volatileId}
              event={event}
              reload={reload}
              setReload={setReload}
              alertConfig={alertConfig}
            />
          </Card>
        </Col>
      </Row>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-automation:recommendedActions')} leftHeaderContent={<BetaBadge />}>
            <RecommendedActionsCardAlerts
              volatileId={volatileId}
              event={event}
              reload={reload}
              setReload={setReload}
              alertConfig={alertConfig}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
