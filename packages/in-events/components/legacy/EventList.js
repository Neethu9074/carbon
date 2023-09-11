/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';

import { Button, Card, Message, Stack, Typography } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  isApplicationSmartAlertEvent,
  isWebsiteSmartAlertEvent,
  isMobileAppSmartAlertEvent
} from 'in-events/components/eventUtil';
import {
  expandedRCAEventCardTracker,
  helpfulRCASuggestionTracker,
  unhelpfulRCASuggestionTracker
} from 'in-events/tracker';
import AssociatedAndRecommendedActions from 'in-automation/AssociatedActions/AssociatedAndRecommendedActions';
import { actionAutomationEnabled, rcaUIEnabled } from 'in-services/featureFlags';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import EventListItem from 'in-events/components/legacy/EventListItem';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { emptyList } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import Pagination from 'in-components/Pagination';
import { getEvent } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

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
    const incidentHasRCAProperty = useMemo(() => incident.get('metadata').has('probableRootCause'), [incident]);
    const rcaEvents = useMemo(
      () => (rcaUIEnabled && incidentHasRCAProperty ? incident.get('metadata').get('probableRootCause') || null : null),
      [incident, incidentHasRCAProperty]
    ); // Holds map of snapshot_ID: [event_id, event_id]
    const snapshots = useMemo(() => (rcaEvents ? Array.from(rcaEvents.keys()) : []), [rcaEvents]); // gets an array of snapshot_IDs [snapshot_ID_1, snapshot_ID_2 ...]

    const [currentRCAEntity, setCurrentRCAEntity] = useState(rcaEvents && rcaEvents.size > 0 ? snapshots[0] : null); // Selects a given snapshot ID
    const [pageNum, setPageNum] = useState(1); // Pagination
    const [observablesList, setObservablesList] = useState(
      currentRCAEntity ? combineLatest(rcaEvents.get(currentRCAEntity).map(getEvent)).throttle(250) : null
    ); // Gets an array of event Observable requests based on the selected rca entity

    const eventTests = useObservable(observablesList, [currentRCAEntity, observablesList]) ?? []; // generates a list of event information based on Observables

    useEffect(() => {
      if (currentRCAEntity) {
        const rcaEventList = rcaEvents.get(currentRCAEntity);
        if (rcaEventList.size > 0) {
          setObservablesList(combineLatest(rcaEvents.get(currentRCAEntity).map(getEvent)));
        } else {
          setObservablesList(null);
        }
      }
    }, [currentRCAEntity, rcaEvents]);

    useEffect(() => {
      setCurrentRCAEntity(snapshots[pageNum - 1]);
    }, [pageNum, snapshots]);

    if (!events) {
      return <ListRow title={t('in-events:titleTriggerEvent')} />;
    }
    const triggeringProblemId = incident.getIn(['problem', 'id']);

    const isTriggeringEvent = ev => ev.getIn(['problem', 'id']) === triggeringProblemId;
    const triggerEvent = events.find(isTriggeringEvent);

    const RegenerateButtonOnClick = () => {
      setPageNum(pageNum);
    };

    return (
      <>
        {eventTests && incidentHasRCAProperty && rcaUIEnabled && (
          <AIEventListRow
            title={'Probable Root Cause Events'}
            events={Array.isArray(eventTests) ? eventTests.sort((a, b) => a.get('start') - b.get('start')) : []}
            triggeringProblemId={eventTests.length > 0 && eventTests[0] && eventTests[0].get('id')}
            latestSnapshot={latestSnapshot}
            isRCA={incidentHasRCAProperty}
            rcaSnapshotID={currentRCAEntity}
            RegenerateComponentOnClick={RegenerateButtonOnClick}
            pageNum={pageNum}
            totalPages={rcaEvents ? Array.from(rcaEvents.keys()).length : null}
            setPageNum={setPageNum}
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

function AIEventListRow({
  title,
  events,
  triggeringProblemId,
  latestSnapshot,
  isRCA,
  rcaSnapshotID,
  RegenerateComponentOnClick,
  pageNum,
  totalPages,
  setPageNum
}) {
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={title}
          leftHeaderContent={<BetaBadge />}
          rightHeaderContent={
            <Stack direction="horizontal" gap="small">
              <Message className={locals.rcaAIMessage} title="AI Generated" />
            </Stack>
          }
        >
          <div className={locals.timeline}>
            {!events && <LoadingIndicator />}
            {events?.map(_event => (
              <div onClick={expandedRCAEventCardTracker}>
                <EventListItem
                  key={_event.get('id')}
                  triggeringProblemId={triggeringProblemId}
                  event={_event}
                  latestSnapshot={latestSnapshot}
                  isRCA={isRCA}
                />
              </div>
            ))}
            {rcaSnapshotID && events.length === 0 && (
              <Message
                title="No Events Found"
                description={`An entity was found as the root cause but no related events could be attributed to it`}
              />
            )}
            {!rcaSnapshotID && (
              <Message
                title="No Probable Root Cause Found"
                description={
                  "This is an experimental feature and in some cases a probable root cause may not be found. We've logged this occurence for future improvements"
                }
              />
            )}
          </div>
          {rcaSnapshotID && (
            <Stack direction="horizontal" gap="normal" distribution="end" align="center">
              <Pagination currentPage={pageNum} numPages={totalPages} onChange={setPageNum} />
              <Button
                icon="lib_actions_sync"
                size="compact"
                kind="secondary"
                onClick={RegenerateComponentOnClick}
                disabled
                className={locals.rcaRegenerate}
              >
                {'Regenerate'}
              </Button>
            </Stack>
          )}
          <Stack direction="horizontal" gap="normal" align="center">
            <Typography variant="body-small">{'Was this suggestion helpful? '}</Typography>
            <Button kind="subtle" size="compact" icon="lib_flame" onClick={helpfulRCASuggestionTracker} />
            <Button kind="subtle" size="compact" icon="lib_openclose_cancel" onClick={unhelpfulRCASuggestionTracker} />
          </Stack>
        </Card>
      </Col>
    </Row>
  );
}
