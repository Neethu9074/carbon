/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import ActionsButtonGroup from 'in-automation/AssociatedActions/ActionsButtonGroup';
import { ApplicationAlertConfigWithMetadata, Event, VolatileId } from 'in-types';
import RecommendedActionsCardAlerts from './RecommendedActionsCardAlerts';
import AssociatedActionsAlerts from './AssociatedActionsAlerts';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import { role } from 'in-stores/user';

interface AssociatedAndRecommendedActionsAlertsProps {
  volatileId: VolatileId;
  event: Event;
  alertConfig: ApplicationAlertConfigWithMetadata;
}

export default function AssociatedAndRecommendedActionsAlerts({
  volatileId,
  event,
  alertConfig
}: AssociatedAndRecommendedActionsAlertsProps) {
  const [reload, setReload] = useState(0);
  const [selectedType, setSelectedType] = useState('associatedActions');
  const eventId = event?.id;

  const alertConfigiguration = useObservable(() => {
    const configId = event?.metadata?.eventSpecificationId;
    const configTimestamp = event?.metadata?.alertConfigCreated;
    return getAlertConfigByIdAndTimestamp(configId, configTimestamp, { asObservable: false });
  }, [event]);
  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card>
            <ActionsButtonGroup selectedType={selectedType} setSelectedType={setSelectedType} />
            {selectedType === 'associatedActions' && (
              <Row withoutSideMargin>
                <Col xs>
                  <AssociatedActionsAlerts
                    volatileId={volatileId}
                    event={event}
                    reload={reload}
                    setReload={setReload}
                    alertConfig={alertConfig ?? alertConfigiguration}
                  />
                </Col>
              </Row>
            )}
            {selectedType === 'recommendedActions' && (
              <Row withoutSideMargin>
                <Col xs>
                  <RecommendedActionsCardAlerts
                    event={event}
                    reload={reload}
                    setReload={setReload}
                    setSelectedType={setSelectedType}
                    alertConfig={alertConfig ?? alertConfigiguration}
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
