/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ThumbsUp, ThumbsUpFilled, ThumbsDown, ThumbsDownFilled } from '@carbon/icons-react';
import React, { useEffect, useMemo, useState } from 'react';

import { Button, Card, Message, Stack, SvgIcon, Typography } from '@instana/components';
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
import { default as EmptyStateMagnifyingGlass } from './assets/empty-state-magnifying-glass.svg';
import { actionAutomationEnabled, rcaUIEnabled } from 'in-services/featureFlags';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import EventListItem from 'in-events/components/legacy/EventListItem';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { emptyList } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
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
            title={t('in-events:RCA.titlePRCA')}
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
  const [feedbackState, setFeedbackState] = useState({ thumbsUp: false, thumbsDown: false });
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={title}
          leftHeaderContent={<BetaBadge />}
          rightHeaderContent={<Message className={locals.rcaAIMessage} title={t('in-events:RCA.AIGenBadgeText')} />}
        >
          <Stack direction="vertical" gap="medium">
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
                <RCAErrorMessage
                  title={t('in-events:RCA.noEventsErrorTitle')}
                  description={t('in-events:RCA.noEventsErrorDescription')}
                />
              )}
              {!rcaSnapshotID && (
                <RCAErrorMessage
                  title={t('in-events:RCA.noEntitiesErrorTitle')}
                  description={t('in-events:RCA.noEntitiesErrorDescription')}
                />
              )}
            </div>
            <Stack direction="horizontal" distribution="spaceBetween">
              <Stack direction="horizontal" gap="small" align="center">
                <Typography variant="body-small">{t('in-events:RCA.suggestionHelpfulText')}</Typography>
                <Button
                  kind="subtle"
                  size="compact"
                  onClick={() => {
                    setFeedbackState({ thumbsDown: false, thumbsUp: true });
                    helpfulRCASuggestionTracker();
                  }}
                >
                  {feedbackState.thumbsUp ? <ThumbsUpFilled /> : <ThumbsUp />}
                </Button>
                <Button
                  kind="subtle"
                  size="compact"
                  onClick={() => {
                    setFeedbackState({ thumbsDown: true, thumbsUp: false });
                    unhelpfulRCASuggestionTracker();
                  }}
                >
                  {feedbackState.thumbsDown ? <ThumbsDownFilled /> : <ThumbsDown />}
                </Button>
              </Stack>
              {rcaSnapshotID && (
                <Stack direction="horizontal" gap="normal" distribution="end" align="center">
                  <EventListPagination pageNum={pageNum} numPages={totalPages} setPageNum={setPageNum} />
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
            </Stack>
          </Stack>
        </Card>
      </Col>
    </Row>
  );
}

function EventListPagination({ pageNum, numPages, setPageNum }) {
  return (
    <Stack direction="horizontal">
      <SvgIcon
        type="lib_arrow_expand_left"
        onClick={() => pageNum > 1 && setPageNum(pageNum - 1)}
        color={pageNum === 1 ? '#00000080' : undefined}
      />
      <Stack direction="horizontal" gap="xsmall" align="center">
        <Typography variant="body-small">{pageNum}</Typography>
        <Typography variant="body-regular">{'/'}</Typography>
        <Typography variant="body-small">{numPages}</Typography>
      </Stack>
      <SvgIcon
        type="lib_arrow_expand_right"
        onClick={() => pageNum < numPages && setPageNum(pageNum + 1)}
        color={pageNum >= numPages ? '#00000080' : undefined}
      />
    </Stack>
  );
}

function RCAErrorMessage({ title, description }) {
  return (
    <Stack direction="horizontal" gap="small" distribution="center">
      <img src={EmptyStateMagnifyingGlass} />
      <Stack direction="vertical" gap="xxsmall">
        <Typography variant="heading-200">{title}</Typography>
        <div className={locals.errorMessageContainer}>
          <Typography variant="body-regular">{description}</Typography>
        </div>
      </Stack>
    </Stack>
  );
}
