/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

import RecommendedActionsForPoliciesCard from 'in-automation/AssociatedActions/RecommendedActionsForPoliciesCard';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import PoliciesButtonGroup from 'in-automation/AssociatedActions/PoliciesButtonGroup';
import AssociatedPoliciesCard from './AssociatedPoliciesCard';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import { Event, VolatileId } from 'in-types';
import { role } from 'in-stores/user';

interface AssociatedAndRecommendedPoliciesProps {
  volatileId: VolatileId;
  event: Event;
}

export default function AssociatedAndRecommendedPolicies({ volatileId, event }: AssociatedAndRecommendedPoliciesProps) {
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
                  <AssociatedPoliciesCard volatileId={volatileId} event={event} reload={reload} setReload={setReload} />
                </Col>
              </Row>
            )}
            {selectedType === 'recommendedActions' && (
              <Row withoutSideMargin>
                <Col xs>
                  <RecommendedActionsForPoliciesCard
                    event={event}
                    reload={reload}
                    setReload={setReload}
                    setSelectedType={setSelectedType}
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
