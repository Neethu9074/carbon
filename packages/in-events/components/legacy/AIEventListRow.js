/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { List, Map } from 'immutable';

import { Card, Stack, Typography, Pill } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/legacy';

import {
  RCAFeedbackClosedManuallyTracker,
  RCAFeedbackNextTracker,
  RCAFeedbackSkipTracker,
  RCAFeedbackSubmitTracker,
  expandedRCAEventCardTracker,
  helpfulRCASuggestionTracker,
  unhelpfulRCASuggestionTracker
} from 'in-events/tracker';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import RootCauseEntityDetails from 'in-events/components/legacy/RootCauseEntityDetails';
import EventFeedbackDialog from 'in-events/components/feedback/EventFeedbackDialog';
import { rcaStepConfig } from 'in-events/components/feedback/rcaStepConfig.tsx';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { rcaUIEnabled } from 'in-services/featureFlags';
import { Row, Col } from 'in-components/layout/Grid';
import { getEvent } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

const defaultFeedbackState = { thumbsDown: false, thumbsUp: false };

export default function AIEventListRow({ title, incident, incidentHasRCAProperty, latestSnapshot }) {
  // Holds map of { snapshot_ID: [event_id, event_id] }
  const isLegacy = incident.hasIn(['metadata', 'probableRootCause']);
  const rcaSnapshotMap = useMemo(
    () => extractProbableRootCauseFromIncident(incident, incidentHasRCAProperty, rcaUIEnabled, isLegacy),
    [incident, incidentHasRCAProperty, isLegacy]
  );

  // gets an array of snapshot_IDs [snapshot_ID_1, snapshot_ID_2 ...]
  const snapshots = useMemo(() => (rcaSnapshotMap ? Array.from(rcaSnapshotMap.keys()) : []), [rcaSnapshotMap]);

  // Selects a given snapshot ID
  const [currentRCAEntity, setCurrentRCAEntity] = useState(
    rcaSnapshotMap && rcaSnapshotMap.size > 0 ? snapshots[0] : null
  );

  //Pagination for different snapshots
  const [pageNum, setPageNum] = useState(1);

  // Holds the list of observables for RCA Events
  const [observablesList, setObservablesList] = useState(
    currentRCAEntity ? combineLatest(rcaSnapshotMap.get(currentRCAEntity).map(getEvent)).throttle(250) : null
  );

  // generates a list of event information based on Observables
  const eventsRelatedToEntity =
    useObservable(currentRCAEntity ? observablesList : null, [currentRCAEntity, observablesList])?.sort(
      (a, b) => a.get('start') - b.get('start')
    ) ?? [];

  useEffect(() => {
    if (currentRCAEntity) setObservablesList(combineLatest(rcaSnapshotMap.get(currentRCAEntity).map(getEvent)));
  }, [currentRCAEntity, rcaSnapshotMap]);

  useEffect(() => {
    setCurrentRCAEntity(snapshots[pageNum - 1]);
  }, [pageNum, snapshots]);

  if (rcaSnapshotMap.size <= 0 || !currentRCAEntity) return null;

  return (
    <ProbableRootCauseCard title={title} incident={incident} currentRCAEntity={currentRCAEntity}>
      <Stack direction="vertical" gap="xsmall">
        <div className={locals.timeline}>
          <RootCauseEntityDetails
            selectedSnapshotMetadata={
              isLegacy
                ? incident.get('metadata').get('probableRootCauseSnapshotMetadata').get(currentRCAEntity)
                : incident.getIn(['metadata', 'rootCause', 'probableRootCauseSnapshotMetadata', currentRCAEntity], null)
            }
            eventsRelatedToEntity={eventsRelatedToEntity}
            probabilityScore={extractProbabilityScoreForProbableRootCause(
              incident.get('metadata'),
              currentRCAEntity,
              isLegacy
            )}
            relatedAPID={
              incident.get('metadata').has('app20ApplicationId')
                ? incident.get('metadata').get('app20ApplicationId')
                : null
            }
            numOfSnapshots={rcaSnapshotMap ? Array.from(rcaSnapshotMap.keys()).length : null}
            pageNum={pageNum}
            setPageNum={setPageNum}
            incidentTimeWindow={{
              windowSize:
                incident.get('end') - incident.get('metadata').get('triggeringTime') + minutes.toMillis(20) ||
                incident.get('end') - incident.get('start') + minutes.toMillis(20),
              to: incident.get('end'),
              focusedMoment:
                incident.get('end') - incident.get('metadata').get('triggeringTime') + minutes.toMillis(20) ||
                incident.get('end') - incident.get('start') + minutes.toMillis(20)
            }}
          />
        </div>
        <ExpandableLightCard
          title={t('in-events:RCA.relatedEventsLabel', {
            number_of_events: Array.isArray(eventsRelatedToEntity) ? eventsRelatedToEntity.length : 0
          })}
        >
          {eventsRelatedToEntity?.map(_event => (
            <div onClick={expandedRCAEventCardTracker}>
              <EventListItem
                key={_event.get('id')}
                triggeringProblemId={eventsRelatedToEntity.length > 0 && eventsRelatedToEntity[0].get('id')}
                event={_event}
                latestSnapshot={latestSnapshot}
                setBackground={themes.default.ids.color.option['deep-purple'][500]}
                setIconColor={themes.default.ids.color.option.white}
              />
            </div>
          ))}
        </ExpandableLightCard>
      </Stack>
    </ProbableRootCauseCard>
  );
}

function FeedbackComponent({ feedbackState, setFeedbackState, incident, snapshotMetadata, currentEntity }) {
  useEffect(() => {
    if (feedbackState[currentEntity] && feedbackState[currentEntity].thumbsDown) {
      addActiveDialog(
        <EventFeedbackDialog
          stepConfig={rcaStepConfig}
          nextStepTracker={RCAFeedbackNextTracker}
          skipStepTracker={RCAFeedbackSkipTracker}
          closedManuallyTracker={RCAFeedbackClosedManuallyTracker}
          submitTracker={RCAFeedbackSubmitTracker}
          submitMetadata={extractFeedbackMetadataFromIncident(incident, snapshotMetadata)}
        />
      );
    }
  }, [feedbackState, incident, snapshotMetadata, currentEntity]);
  /*
{'default': {thumbsUp: false, thumbsDown: false}}
*/
  return (
    <Stack direction="horizontal" gap="small" align="center">
      {feedbackState[currentEntity]?.thumbsDown || feedbackState[currentEntity]?.thumbsUp ? (
        <Typography variant="body-small">{t('in-events:RCA.thankYouForYourFeedback')}</Typography>
      ) : (
        <Typography variant="body-small">{t('in-events:RCA.suggestionHelpfulText')}</Typography>
      )}
      <Button
        kind="subtle"
        // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
        //TODO: Find an alternative to this (i.e. bring in a filled in thumbs up icon)
        style={
          feedbackState[currentEntity]?.thumbsUp
            ? { background: themes.default.ids.color.option.neutral['300'] }
            : undefined
        }
        size="compact"
        icon="lib_thumbs_up"
        iconSize="s"
        onClick={() => {
          helpfulRCASuggestionTracker();
          if (feedbackState[currentEntity]?.thumbsUp) {
            setFeedbackState({ ...feedbackState, [currentEntity]: defaultFeedbackState });
          } else {
            setFeedbackState({ ...feedbackState, [currentEntity]: { ...defaultFeedbackState, thumbsUp: true } });
          }
        }}
      />
      <Button
        kind="subtle"
        // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
        //TODO: Find an alternative to this (i.e. bring in a filled in thumbs down icon)
        style={
          feedbackState[currentEntity]?.thumbsDown
            ? { background: themes.default.ids.color.option.neutral['300'] }
            : undefined
        }
        size="compact"
        iconSize="s"
        icon="lib_thumbs_down"
        onClick={() => {
          unhelpfulRCASuggestionTracker();
          if (feedbackState[currentEntity]?.thumbsDown) {
            setFeedbackState({ ...feedbackState, [currentEntity]: defaultFeedbackState });
          } else {
            setFeedbackState({ ...feedbackState, [currentEntity]: { ...defaultFeedbackState, thumbsDown: true } });
          }
        }}
      />
    </Stack>
  );
}

function extractFeedbackMetadataFromIncident(incident, snapshotMetadata) {
  let entityType = '';

  const metrics = incident.get('metadata')?.get('metrics') ?? new List();

  const metricInfo = metrics
    .map(metricObject => {
      return metricObject.get('metricName');
    })
    .toArray();
  if (snapshotMetadata && snapshotMetadata.has('EntityType')) entityType = snapshotMetadata.get('EntityType');

  return { entityType, metricInfo };
}

// Eventually should be directly retrieved once all RCA inclusive events don't use the old data structure anymore
// See https://github.ibm.com/instana/ui-client/pull/13705
function extractProbableRootCauseFromIncident(incident, incidentHasRCAProperty, rcaUIEnabled, isLegacy) {
  if (!rcaUIEnabled || !incidentHasRCAProperty) return null;
  if (isLegacy) {
    const legacyProbableRootCauseFromIncident = incident.getIn(['metadata', 'probableRootCause'], null);
    if (Array.isArray(legacyProbableRootCauseFromIncident)) {
      return legacyProbableRootCauseFromIncident;
    } else if (List.isList(legacyProbableRootCauseFromIncident)) {
      return iterateThroughRCAEventsAndReturnMapOfIDWithEvents(legacyProbableRootCauseFromIncident, isLegacy);
    }
  } else {
    const probableRootCauseEvents = incident.getIn(['metadata', 'rootCause', 'rcaSnapshotsEvents'], null);
    if (probableRootCauseEvents)
      return iterateThroughRCAEventsAndReturnMapOfIDWithEvents(probableRootCauseEvents, isLegacy);
  }
  return {};
}

function iterateThroughRCAEventsAndReturnMapOfIDWithEvents(rcaEventsList, isLegacy) {
  let probableRootCauseWithSnapshotIDsAsKeys = Map();
  const snapshotIDKey = isLegacy ? 'RCASnapshotID' : 'rcaSnapshotID';
  const rcaEventsKey = 'rcaEvents';
  rcaEventsList.forEach(snapshot => {
    if (!snapshot || !snapshot.has(snapshotIDKey) || !snapshot.has(rcaEventsKey)) return null;

    const rcaEvents = snapshot.get(rcaEventsKey).toArray();
    let snapshotID = '';

    if (List.isList(snapshot.get(snapshotIDKey))) {
      snapshotID = snapshot.get(snapshotIDKey).first();
    } else if (snapshot.get(snapshotIDKey) instanceof String || typeof snapshot.get(snapshotIDKey) === 'string') {
      snapshotID = snapshot.get(snapshotIDKey);
    }
    probableRootCauseWithSnapshotIDsAsKeys = probableRootCauseWithSnapshotIDsAsKeys.set(snapshotID, rcaEvents);
  });
  return probableRootCauseWithSnapshotIDsAsKeys;
}

function extractProbabilityScoreForProbableRootCause(incidentMetadata, selectedSnapshot, isLegacy) {
  let probableRootCauseArray;

  if (!isLegacy) {
    probableRootCauseArray = incidentMetadata.getIn(['rootCause', 'rcaSnapshotsEvents']);
  } else {
    probableRootCauseArray = incidentMetadata.getIn(['probableRootCause'], null);
  }

  const snapshotIDKey = isLegacy ? 'RCASnapshotID' : 'rcaSnapshotID';
  const rcaProbKey = 'rcaProbFailure';

  if (List.isList(probableRootCauseArray)) {
    const foundSnapshot = probableRootCauseArray.find(
      snapshotData => snapshotData.get(snapshotIDKey) === selectedSnapshot
    );
    if (foundSnapshot && foundSnapshot.get(rcaProbKey)) return foundSnapshot.get(rcaProbKey);
  }
  return null;
}

function ProbableRootCauseCard({ title, incident, currentRCAEntity, children }) {
  const [feedbackState, setFeedbackState] = useState({ default: defaultFeedbackState });

  useEffect(() => {
    if (currentRCAEntity && !feedbackState[currentRCAEntity])
      setFeedbackState({ ...feedbackState, [currentRCAEntity]: defaultFeedbackState });
  }, [currentRCAEntity, feedbackState]);
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={title}
          leftHeaderContent={
            <Stack direction="horizontal">
              <Tooltip align="topRight" content={t('in-events:RCA.performanceConstantlyEvaluated')}>
                <Pill
                  kind="primary"
                  color={themes.default.ids.color.option.blue['400']}
                  className={locals.techPreviewPill}
                >
                  <Typography variant="body-small" onDark>
                    {t('in-events:RCA.techPreview')}
                  </Typography>
                </Pill>
              </Tooltip>
              <Pill color={'#8257D933'} className={locals.rcaAIPill}>
                <Typography variant="body-small">{t('in-events:RCA.AIGenBadgeText')}</Typography>
              </Pill>
            </Stack>
          }
          rightHeaderContent={
            currentRCAEntity &&
            incident && (
              <FeedbackComponent
                feedbackState={feedbackState}
                setFeedbackState={setFeedbackState}
                incident={incident}
                snapshotMetadata={
                  incident.get('metadata')?.get('probableRootCauseSnapshotMetadata')?.get(currentRCAEntity) ?? null
                }
                currentEntity={currentRCAEntity ?? 'default'}
              />
            )
          }
        >
          {children}
        </Card>
      </Col>
    </Row>
  );
}
