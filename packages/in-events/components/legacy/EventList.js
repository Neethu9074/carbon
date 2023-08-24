/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { combineLatest } from '@instana/observables';
import { Button, Card } from '@instana/components';

import {
  isApplicationSmartAlertEvent,
  isWebsiteSmartAlertEvent,
  isMobileAppSmartAlertEvent
} from 'in-events/components/eventUtil';
import AssociatedAndRecommendedActions from 'in-automation/AssociatedActions/AssociatedAndRecommendedActions';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import { emptyList } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import { getEvent } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import 'in-events/components/legacy/EventList.less';

const block = 'in-event-view-incident-event-list';

const rcaEvents = {
  'P7eIvb_i1AX-iOQ7Z9UQLezDx-Y': ['dSmKQZCbQ5CHfJGycCyu9A', 'sWhc3jGwQ1CIM7Toe6JzBQ', 'Wn9dKYJsRLG1XbMqMQfXpA']
};

export default connectTo(
  ({ incident }) => ({
    events: combineLatest(incident.get('recentEvents', emptyList).toArray().map(getEvent))
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
    testRCA: combineLatest(rcaEvents['P7eIvb_i1AX-iOQ7Z9UQLezDx-Y'].map(getEvent)).map(events =>
      events.filter(e => e && !e.isEmpty())
    )
  }),
  function IncidentEventList({ events, incident, latestSnapshot, snapshot, testRCA }) {
    const [currentRCAEvent, setCurrentRCAEvent] = useState(0);
    //const [currentRCAEntity, setCurrentRCAEntity] = useState('P7eIvb_i1AX-iOQ7Z9UQLezDx-Y');
    if (!events) {
      return <ListRow title={t('in-events:titleTriggerEvent')} />;
    }
    const triggeringProblemId = incident.getIn(['problem', 'id']);

    const isTriggeringEvent = ev => ev.getIn(['problem', 'id']) === triggeringProblemId;
    const triggerEvent = events.find(isTriggeringEvent);

    // Entity ID : [snapshot_id_1, shapshot_id_2, snapshot_id_3]

    const RegenerateButtonOnClick = () => {
      if (currentRCAEvent === testRCA.length - 1) {
        setCurrentRCAEvent(0);
      } else {
        setCurrentRCAEvent(currentRCAEvent + 1);
      }
    };

    return (
      <>
        {testRCA && (
          <ListRow
            title={'Probable Root Cause'}
            events={[testRCA[currentRCAEvent]]}
            triggeringProblemId={testRCA[currentRCAEvent]}
            latestSnapshot={latestSnapshot}
            regenerateEventEnabled
            RegenerateComponentOnClick={RegenerateButtonOnClick}
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
);

function ListRow({
  title,
  events,
  triggeringProblemId,
  latestSnapshot,
  regenerateEventEnabled,
  RegenerateComponentOnClick
}) {
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={title}
          rightHeaderContent={
            regenerateEventEnabled && <Button onClick={RegenerateComponentOnClick}>{'Regenerate'}</Button>
          }
        >
          <div className={`${block}__timeline`}>
            {!events && <LoadingIndicator />}
            {events?.map(_event => (
              <EventListItem
                key={_event.get('id')}
                triggeringProblemId={triggeringProblemId}
                event={_event}
                latestSnapshot={latestSnapshot}
              />
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  );
}
