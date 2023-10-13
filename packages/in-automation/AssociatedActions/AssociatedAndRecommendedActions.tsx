/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

import RecommendedActionsCard from 'in-automation/AssociatedActions/RecommendedActionsCard';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import ActionsButtonGroup from 'in-automation/AssociatedActions/ActionsButtonGroup';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import AssociatedActions from './AssociatedActionsCard';
import { Event, VolatileId } from 'in-types';
import { role } from 'in-stores/user';

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
  const [selectedType, setSelectedType] = useState('associatedActions');
  const eventId = event?.id;
  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card>
            <ActionsButtonGroup selectedType={selectedType} setSelectedType={setSelectedType} />
            {selectedType === 'associatedActions' && (
              <Row withoutSideMargin>
                <Col xs>
                  <AssociatedActions
                    title={associatedActionsTitle}
                    volatileId={volatileId}
                    event={event}
                    reload={reload}
                    setReload={setReload}
                  />
                </Col>
              </Row>
            )}
            {selectedType === 'recommendedActions' && (
              <Row withoutSideMargin>
                <Col xs>
                  <RecommendedActionsCard
                    volatileId={volatileId}
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
