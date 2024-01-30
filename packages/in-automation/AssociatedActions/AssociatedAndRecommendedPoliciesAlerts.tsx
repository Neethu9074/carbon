/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import RecommendedActionsAlertsForPolicies from 'in-automation/AssociatedActions/RecommendedActionsAlertsForPoliciesCard';
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import AssociatedPoliciesAlerts from 'in-automation/AssociatedActions/AssociatedPoliciesAlerts';
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
            <PoliciesButtonGroup selectedType={selectedType} setSelectedType={setSelectedType} />
            {selectedType === 'associatedPolicies' && (
              <Row withoutSideMargin>
                <Col xs>
                  <AssociatedPoliciesAlerts
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
                  <RecommendedActionsAlertsForPolicies
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
