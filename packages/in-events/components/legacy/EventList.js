/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';
import { Card } from '@instana/components';

import { isApplicationSmartAlertEvent, isWebsiteSmartAlertEvent } from 'in-events/components/eventUtil';
import AssociatedActions from 'in-automation/AssociatedActionsCard/AssociatedActionsCard';
import RecommendedActions from 'in-automation/RecommendedActions/RecommendedActions';
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
      .throttle(250)
  }),
  function IncidentEventList({ events, incident, latestSnapshot, snapshot }) {
    if (!events) {
      return <ListRow title={t('in-events:titleTriggerEvent')} />;
    }

    const triggeringProblemId = incident.getIn(['problem', 'id']);

    const isTriggeringEvent = ev => ev.getIn(['problem', 'id']) === triggeringProblemId;
    const triggerEvent = events.find(isTriggeringEvent);

    return (
      <>
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
          !isApplicationSmartAlertEvent(triggerEvent) && (
            <Row withoutSideMargin>
              <Col xs>
                <Card>
                  <AssociatedActions
                    title={t('in-events:actionsAssociatedForTriggeringEvent')}
                    volatileId={snapshot?.get('volatileId')?.toJS() ?? {}}
                    event={triggerEvent?.toJS()}
                  />
                </Card>
              </Col>
            </Row>
          )}
        {actionAutomationEnabled &&
          role.canConfigureAutomationActions &&
          role.canConfigureCustomAlerts &&
          !isWebsiteSmartAlertEvent(triggerEvent) &&
          !isApplicationSmartAlertEvent(triggerEvent) && (
            <Row withoutSideMargin>
              <Col xs>
                <Card title={t('in-events:recommendedActions')}>
                  <RecommendedActions
                    volatileId={snapshot?.get('volatileId')?.toJS() ?? {}}
                    event={triggerEvent?.toJS()}
                  />
                </Card>
              </Col>
            </Row>
          )}
      </>
    );
  }
);

function ListRow({ title, events, triggeringProblemId, latestSnapshot }) {
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card title={title}>
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
