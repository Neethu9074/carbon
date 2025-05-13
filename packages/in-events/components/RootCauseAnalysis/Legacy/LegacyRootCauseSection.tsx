/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState, ReactNode } from 'react';
import { List, Map } from 'immutable';

import { Card, Stack, Typography, Pill, IconButton, PreviewPill } from '@instana/components';
import { Observable, combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { Snapshot } from '@instana/types';

import {
  EVENT_RCA_SUGGESTION_HELPFUL,
  EVENT_RCA_SUGGESTION_UNHELPFUL,
  EVENT_RCA_FEEDBACK_NEXT,
  EVENT_RCA_FEEDBACK_SKIP,
  EVENT_RCA_FEEDBACK_CLOSED_MANUALLY,
  EVENT_RCA_FEEDBACK_SUBMIT
} from 'in-services/tracking/tracking';
import LegacyRootCauseEntityDetails from 'in-events/components/RootCauseAnalysis/Legacy/LegacyRootCauseEntityDetails';
// @ts-expect-error
import { rcaStepConfig } from 'in-events/components/feedback/rcaStepConfig.tsx';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import EventFeedbackDialog from 'in-events/components/feedback/EventFeedbackDialog';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
//@ts-expect-error
import { getEvent } from 'in-stores/events';
import { rcaUIEnabled } from 'in-services/featureFlags';
import { Row, Col } from 'in-components/layout/Grid';
import { EventOrMap } from 'in-events/types';
import Tooltip from 'in-components/Tooltip';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

const defaultFeedbackState = { thumbsDown: false, thumbsUp: false };

interface FeedbackStateType {
  [index: string]: {
    thumbsDown: boolean;
    thumbsUp: boolean;
  };
}

interface LegacyRootCauseSectionProps {
  title: string;
  incident: EventOrMap;
  incidentHasRCAProperty: boolean;
  latestSnapshot: Snapshot;
}

interface FeedbackComponentProps {
  feedbackState: FeedbackStateType;
  setFeedbackState: React.Dispatch<React.SetStateAction<FeedbackStateType>>;
  incident: EventOrMap;
  snapshotMetadata: Map<string, string>;
  currentEntity: any;
}

interface ProbableRootCauseCardProps {
  title: string;
  incident: EventOrMap;
  currentRCAEntity: string;
  children: ReactNode;
}

export default function LegacyRootCauseSection({
  title,
  incident,
  incidentHasRCAProperty,
  latestSnapshot
}: LegacyRootCauseSectionProps) {
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'root cause analysis';
  const { trackCta } = useSegmentTracking();

  // Holds map of { snapshot_ID: [event_id, event_id] }
  const isLegacy = incident.hasIn(['metadata', 'probableRootCause']);
  const rcaSnapshotMap = useMemo(
    () => extractProbableRootCauseFromIncident(incident, incidentHasRCAProperty, rcaUIEnabled, isLegacy),
    [incident, incidentHasRCAProperty, isLegacy]
  );
  // gets an array of snapshot_IDs [snapshot_ID_1, snapshot_ID_2 ...]

  const snapshots = useMemo<string[]>(
    //@ts-expect-error
    () => (rcaSnapshotMap ? Array.from(rcaSnapshotMap.keys()) : []),
    [rcaSnapshotMap]
  );

  // Selects a given snapshot ID
  const [currentRCAEntity, setCurrentRCAEntity] = useState<string | null>(
    rcaSnapshotMap && rcaSnapshotMap.size > 0 ? snapshots[0] : null
  );

  //Pagination for different snapshots
  const [pageNum, setPageNum] = useState<number>(1);

  // Holds the list of observables for RCA Events
  const [observablesList, setObservablesList] = useState<Observable<EventOrMap[]>>(
    //@ts-expect-error
    currentRCAEntity
      ? //@ts-expect-error
        combineLatest((rcaSnapshotMap?.get(currentRCAEntity) as string[]).map(getEvent)).throttle(250)
      : null
  );

  // generates a list of event information based on Observables
  const eventsRelatedToEntity =
    useObservable(currentRCAEntity ? observablesList : null, [currentRCAEntity, observablesList])?.sort(
      (a, b) => (a.get('start') as number) - (b.get('start') as number)
    ) ?? [];

  useEffect(() => {
    if (currentRCAEntity)
      setObservablesList(combineLatest((rcaSnapshotMap?.get(currentRCAEntity) as string[]).map(getEvent)));
  }, [currentRCAEntity, rcaSnapshotMap]);

  useEffect(() => {
    setCurrentRCAEntity(snapshots[pageNum - 1]);
  }, [pageNum, snapshots]);

  if (!rcaSnapshotMap || rcaSnapshotMap.size <= 0 || !currentRCAEntity) return null;
  const rcaSnapshotMetadata = generateSelectedSnapshotMetdataForNewRCA(incident, currentRCAEntity);

  if (!rcaSnapshotMetadata) return null;

  return (
    <ProbableRootCauseCard title={title} incident={incident} currentRCAEntity={currentRCAEntity}>
      <Stack direction="vertical" gap="xsmall">
        <div className={locals.timeline}>
          <LegacyRootCauseEntityDetails
            selectedSnapshotMetadata={generateSelectedSnapshotMetdataForNewRCA(incident, currentRCAEntity)}
            explainabilityMetadata={
              isLegacy
                ? undefined
                : incident.getIn(['metadata', 'rootCause', 'explainability', currentRCAEntity], undefined)
            }
            probabilityScore={extractProbabilityScoreForProbableRootCause(
              incident.get('metadata') as Map<string, string>,
              currentRCAEntity,
              isLegacy
            )}
            relatedAPID={
              (incident.get('metadata') as Map<string, string>).has('app20ApplicationId')
                ? (incident.get('metadata') as Map<string, string>).get('app20ApplicationId')
                : null
            }
            //@ts-expect-error
            numOfSnapshots={rcaSnapshotMap ? Array.from(rcaSnapshotMap.keys()).length : null}
            pageNum={pageNum}
            setPageNum={setPageNum}
            incidentTimeWindow={{
              windowSize:
                (incident.get('end') as number) -
                  incident.getIn(['metadata', 'triggeringTime'], 0) +
                  minutes.toMillis(20) ||
                (incident.get('end') as number) - (incident.get('start') as number) + minutes.toMillis(20),
              to: incident.get('end') as number,
              focusedMoment:
                (incident.get('end') as number) -
                  incident.getIn(['metadata', 'triggeringTime'], 0) +
                  minutes.toMillis(20) ||
                (incident.get('end') as number) - (incident.get('start') as number) + minutes.toMillis(20),
              autoRefresh: false
            }}
          />
        </div>
        <ExpandableLightCard
          title={t('in-events:RCA.relatedEventsLabel', {
            number_of_events: Array.isArray(eventsRelatedToEntity) ? eventsRelatedToEntity.length : 0
          })}
          darkFrame
        >
          {eventsRelatedToEntity?.map((_event: EventOrMap) => (
            <div
              onClick={() => {
                trackCta(EVENT_RCA_SUGGESTION_HELPFUL, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
              }}
            >
              <EventListItem
                key={_event.get('id') as string}
                triggeringProblemId={
                  eventsRelatedToEntity.length > 0 ? (eventsRelatedToEntity[0].get('id') as string) : undefined
                }
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

function FeedbackComponent({
  feedbackState,
  setFeedbackState,
  incident,
  snapshotMetadata,
  currentEntity
}: FeedbackComponentProps) {
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'root cause analysis';
  const { trackCta } = useSegmentTracking();

  const { location } = useNavigation();

  useEffect(() => {
    if (feedbackState[currentEntity] && feedbackState[currentEntity].thumbsDown) {
      addActiveDialog(
        <EventFeedbackDialog
          stepConfig={rcaStepConfig}
          nextStepTracker={() => {
            trackCta(EVENT_RCA_FEEDBACK_NEXT, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
          }}
          skipStepTracker={() => {
            trackCta(EVENT_RCA_FEEDBACK_SKIP, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
          }}
          closedManuallyTracker={() => {
            trackCta(EVENT_RCA_FEEDBACK_CLOSED_MANUALLY, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
          }}
          submitTracker={() => {
            trackCta(EVENT_RCA_FEEDBACK_SUBMIT, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
          }}
        />
      );
    }
  }, [feedbackState, incident, snapshotMetadata, currentEntity, location, trackCta]);

  return (
    <Stack direction="horizontal" gap="small" align="center">
      {feedbackState[currentEntity]?.thumbsDown || feedbackState[currentEntity]?.thumbsUp ? (
        <Typography variant="body-regular">{t('in-events:RCA.thankYouForYourFeedback')}</Typography>
      ) : (
        <Typography variant="body-regular">{t('in-events:RCA.suggestionHelpfulText')}</Typography>
      )}
      <IconButton
        kind="action"
        size="xl"
        type="lib_thumbs_up"
        iconSize="xs"
        onClick={() => {
          trackCta(EVENT_RCA_SUGGESTION_HELPFUL, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
          if (feedbackState[currentEntity]?.thumbsUp) {
            setFeedbackState({ ...feedbackState, [currentEntity]: defaultFeedbackState });
          } else {
            setFeedbackState({ ...feedbackState, [currentEntity]: { ...defaultFeedbackState, thumbsUp: true } });
          }
        }}
      />
      <IconButton
        kind="action"
        size="xl"
        type="lib_thumbs_down"
        iconSize="xs"
        onClick={() => {
          trackCta(EVENT_RCA_SUGGESTION_UNHELPFUL, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
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

function generateSelectedSnapshotMetdataForNewRCA(
  incident: EventOrMap,
  currentRCAEntity: string
): Map<string, string> | undefined {
  const rootCauseMetadata = incident.getIn(['metadata', 'rootCause'], undefined);

  if (incident.hasIn(['metadata', 'probableRootCauseSnapshotMetadata', currentRCAEntity])) {
    return incident.getIn(['metadata', 'probableRootCauseSnapshotMetadata', currentRCAEntity]);
  } else if (incident.hasIn(['metadata', 'rootCause', 'probableRootCauseSnapshotMetadata', currentRCAEntity])) {
    return incident.getIn(['metadata', 'rootCause', 'probableRootCauseSnapshotMetadata', currentRCAEntity], null);
  }
  if (!rootCauseMetadata) return undefined;

  const rootCauseMap = rootCauseMetadata.get('rootCause', undefined) as Map<
    string,
    Map<string, string | Map<string, string> | number>
  >;

  if (!rootCauseMap) return undefined;

  const probableRootCauseSnapshotMetadata = Map() as Map<string, string>;

  rootCauseMap.forEach((snapshotMap, snapshotID) => {
    if (snapshotID && snapshotMap && snapshotID === currentRCAEntity) {
      probableRootCauseSnapshotMetadata.set(
        'EntityType',
        determineEntityTypeFromEntityIDMap(snapshotMap as Map<string, string>)
      );
      probableRootCauseSnapshotMetadata.set('UntransformedEntityID', snapshotID);
    }
  });

  return probableRootCauseSnapshotMetadata;
}

function determineEntityTypeFromEntityIDMap(entityID: Map<string, string>) {
  const pluginName = translateFullyQualifiedPluginToShortPluginName(entityID.get('pluginID'));

  if (pluginName === 'application' || pluginName === 'service' || pluginName === 'endpoint') return pluginName;

  return 'infrastructure';
}

// Eventually should be directly retrieved once all RCA inclusive events don't use the old data structure anymore
// See https://github.ibm.com/instana/ui-client/pull/13705
function extractProbableRootCauseFromIncident(
  incident: EventOrMap,
  incidentHasRCAProperty: boolean,
  rcaUIEnabled: boolean,
  isLegacy: boolean
): Map<string, string | string[]> | undefined {
  if (!rcaUIEnabled || !incidentHasRCAProperty) return undefined;
  if (isLegacy) {
    const legacyProbableRootCauseFromIncident = incident.getIn(['metadata', 'probableRootCause'], null);
    if (Array.isArray(legacyProbableRootCauseFromIncident)) {
      return undefined;
    } else if (List.isList(legacyProbableRootCauseFromIncident)) {
      return iterateThroughRCAEventsAndReturnMapOfIDWithEvents(legacyProbableRootCauseFromIncident, isLegacy);
    }
  } else {
    const probableRootCauseEvents = incident.getIn(['metadata', 'rootCause', 'rcaSnapshotsEvents'], null);
    if (probableRootCauseEvents)
      return iterateThroughRCAEventsAndReturnMapOfIDWithEvents(probableRootCauseEvents, isLegacy);
  }
  return undefined;
}

function iterateThroughRCAEventsAndReturnMapOfIDWithEvents(
  rcaEventsList: Map<string, List<string> | string>[],
  isLegacy: boolean
): Map<string, string | string[]> {
  let probableRootCauseWithSnapshotIDsAsKeys = Map() as Map<string, string | string[]>;
  const snapshotIDKey = isLegacy ? 'RCASnapshotID' : 'rcaSnapshotID';
  const rcaEventsKey = 'rcaEvents';
  rcaEventsList.forEach(snapshot => {
    if (!snapshot || !snapshot.has(snapshotIDKey) || !snapshot.has(rcaEventsKey)) return null;

    const rcaEvents = (snapshot.get(rcaEventsKey) as List<string>).toArray();
    let snapshotID = '';

    if (List.isList(snapshot.get(snapshotIDKey))) {
      snapshotID = (snapshot.get(snapshotIDKey) as List<string>).first();
    } else if (snapshot.get(snapshotIDKey) instanceof String || typeof snapshot.get(snapshotIDKey) === 'string') {
      snapshotID = snapshot.get(snapshotIDKey) as string;
    }
    probableRootCauseWithSnapshotIDsAsKeys = probableRootCauseWithSnapshotIDsAsKeys.set(snapshotID, rcaEvents);
    return;
  });
  return probableRootCauseWithSnapshotIDsAsKeys;
}

function extractProbabilityScoreForProbableRootCause(
  incidentMetadata: Map<string, string>,
  selectedSnapshot: string,
  isLegacy: boolean
) {
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
      (snapshotData: Map<string, string>) => snapshotData.get(snapshotIDKey) === selectedSnapshot
    );
    if (foundSnapshot && foundSnapshot.get(rcaProbKey)) return foundSnapshot.get(rcaProbKey);
  }
  return null;
}

function ProbableRootCauseCard({ title, incident, currentRCAEntity, children }: ProbableRootCauseCardProps) {
  const [feedbackState, setFeedbackState] = useState<FeedbackStateType>({ default: defaultFeedbackState });
  const rcaSnapshotMetadata = generateSelectedSnapshotMetdataForNewRCA(incident, currentRCAEntity);

  useEffect(() => {
    if (currentRCAEntity && !feedbackState[currentRCAEntity])
      setFeedbackState({ ...feedbackState, [currentRCAEntity]: defaultFeedbackState });
  }, [currentRCAEntity, feedbackState]);

  if (!rcaSnapshotMetadata) return null;
  return (
    <Row withoutSideMargin>
      <Col xs>
        <div className={locals.cardIndicator} />
        <Card
          title={title}
          leftHeaderContent={
            <Stack direction="horizontal" gap="xxsmall">
              <Tooltip align="topRight" content={t('in-events:RCA.performanceConstantlyEvaluated')}>
                <PreviewPill className={locals.techPreviewPill} />
              </Tooltip>
              <Pill type="purple" className={locals.rcaAIPill}>
                {t('in-events:RCA.AIGenBadgeText')}
              </Pill>
            </Stack>
          }
          rightHeaderContent={
            currentRCAEntity && incident ? (
              <FeedbackComponent
                feedbackState={feedbackState}
                setFeedbackState={setFeedbackState}
                incident={incident}
                snapshotMetadata={rcaSnapshotMetadata}
                currentEntity={currentRCAEntity ?? 'default'}
              />
            ) : undefined
          }
        >
          {children}
        </Card>
      </Col>
    </Row>
  );
}
