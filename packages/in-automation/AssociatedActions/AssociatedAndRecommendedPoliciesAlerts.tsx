/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

//import AssociatedActionsAlerts from './AssociatedActionsAlerts';
import AssociatedPoliciesAlerts from 'in-automation/AssociatedActions/AssociatedPoliciesAlerts';
import RecommendedActionsAlertsForPolicies from 'in-automation/AssociatedActions/RecommendedActionsAlertsForPoliciesCard';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import PoliciesButtonGroup from 'in-automation/AssociatedActions/PoliciesButtonGroup';
import { ApplicationAlertConfigWithMetadata, Event, VolatileId } from 'in-types';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import { role } from 'in-stores/user';

interface AssociatedAndRecommendedPoliciesAlertsProps {
  volatileId: VolatileId;
  event: Event;
  alertConfig?: ApplicationAlertConfigWithMetadata;
}

export default function AssociatedAndRecommendedPoliciesAlerts({
  volatileId,
  event,
  alertConfig
}: AssociatedAndRecommendedPoliciesAlertsProps) {
  const [reload, setReload] = useState(0);
  const [selectedType, setSelectedType] = useState('associatedPolicies');
  const eventId = event?.id;
  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card>
            <PoliciesButtonGroup selectedType={selectedType} setSelectedType={setSelectedType} />
            {selectedType === 'associatedPolicies' && (
              <Row withoutSideMargin>
                <Col xs>
                  <AssociatedPoliciesAlerts
                    volatileId={volatileId}
                    event={event}
                    reload={reload}
                    setReload={setReload}
                    alertConfig={alertConfig}
                  />
                </Col>
              </Row>
            )}
            {selectedType === 'recommendedActions' && (
              <Row withoutSideMargin>
                <Col xs>
                  <RecommendedActionsAlertsForPolicies
                    volatileId={volatileId}
                    event={event}
                    reload={reload}
                    setReload={setReload}
                    setSelectedType={setSelectedType}
                    alertConfig={alertConfig}
                  />
                </Col>
              </Row>
            )}
            {selectedType === 'actionHistory' && role?.canViewAutomationActionInstances && (
              <Row withoutSideMargin>
                <Col xs>
                  <ActionHistoryTable eventId={eventId} />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}
