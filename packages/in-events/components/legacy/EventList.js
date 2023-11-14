/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import {
  isApplicationSmartAlertEvent,
  isWebsiteSmartAlertEvent,
  isMobileAppSmartAlertEvent
} from 'in-events/components/eventUtil';
import AssociatedAndRecommendedActions from 'in-automation/AssociatedActions/AssociatedAndRecommendedActions';
import { actionAutomationEnabled, rcaUIEnabled } from 'in-services/featureFlags';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import AIEventListRow from 'in-events/components/legacy/AIEventListRow';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { emptyList } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import { getEvent } from 'in-stores/events';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function IncidentEventList({ incident, latestSnapshot, snapshot }) {
  const events =
    useObservable(
      combineLatest(incident.get('recentEvents', emptyList).toArray().map(getEvent))
        .map(events =>
          events
            .filter(e => e && !e.isEmpty())
            .sort(
              (a, b) =>
                incident.getIn(['issueOrderMap', a.get('id')], a.get('start')) -
                incident.getIn(['issueOrderMap', b.get('id')], b.get('start'))
            )
        )
        .throttle(250),
      [incident]
    ) ?? null;
  const incidentHasRCAProperty = useMemo(() => incident.get('metadata').has('probableRootCause'), [incident]);

  if (!events) return <ListRow title={t('in-events:titleTriggerEvent')} />;

  const triggeringProblemId = incident.getIn(['problem', 'id']);

  const isTriggeringEvent = ev => ev.getIn(['problem', 'id']) === triggeringProblemId;
  const triggerEvent = events.find(isTriggeringEvent);

  return (
    <>
      {incidentHasRCAProperty && rcaUIEnabled && (
        <AIEventListRow
          title={t('in-events:RCA.titlePRCA')}
          incident={incident}
          latestSnapshot={latestSnapshot}
          incidentHasRCAProperty={incidentHasRCAProperty}
        />
      )}

      <ListRow
        title={t('in-events:titleTriggerEvent')}
        events={events.filter(isTriggeringEvent)}
        triggeringProblemId={triggeringProblemId}
        latestSnapshot={latestSnapshot}
      />
      <ListRow
        title={t('in-events:titleRelatedEvents', {
          eventCount: events.length - 1
        })}
        events={events.filter(ev => !isTriggeringEvent(ev))}
        triggeringProblemId={triggeringProblemId}
        latestSnapshot={latestSnapshot}
      />
      {actionAutomationEnabled &&
        role.canConfigureAutomationActions &&
        role.canConfigureCustomAlerts &&
        !isWebsiteSmartAlertEvent(triggerEvent) &&
        !isApplicationSmartAlertEvent(triggerEvent) &&
        !isMobileAppSmartAlertEvent(triggerEvent) && (
          <AssociatedAndRecommendedActions
            associatedActionsTitle={t('in-events:associatedActionsForTriggeringEvent')}
            volatileId={snapshot?.get('volatileId')?.toJS() ?? {}}
            event={triggerEvent?.toJS()}
          />
        )}
    </>
  );
}

function ListRow({ title, events, triggeringProblemId, latestSnapshot }) {
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card title={title}>
          {!events && <LoadingIndicator />}
          {events?.map(_event => (
            <EventListItem
              key={_event.get('id')}
              triggeringProblemId={triggeringProblemId}
              event={_event}
              latestSnapshot={latestSnapshot}
            />
          ))}
        </Card>
      </Col>
    </Row>
  );
}
