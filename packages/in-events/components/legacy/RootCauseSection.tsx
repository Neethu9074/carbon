/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { List, Map } from 'immutable';

import { Card, IconButton, Pill, Stack, Typography } from '@instana/components';
import { Observable, combineLatest } from '@instana/observables';
import { Snapshot, TimeConfig } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

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
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import EventFeedbackDialog from 'in-events/components/feedback/EventFeedbackDialog';
import { rcaStepConfig } from 'in-events/components/feedback/rcaStepConfig';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
//@ts-expect-error
import { getEvent } from 'in-stores/events';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { minutes } from 'in-services/time/time';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface RootCauseSectionProps {
  title: string;
  incident: EventOrMap;
  incidentHasRCAProperty: boolean;
  latestSnapshot: Snapshot;
}
const defaultFeedbackState = { thumbsDown: false, thumbsUp: false };

// Typescript Probable Root Cause Reference
type ProbableCauseSnapshotKeys = 'entityID' | 'explainability' | 'probFailure' | 'events';
interface ProbableCauseSnapshotValues {
  entityID: Map<string, string>;
  explainability: Map<ExplainabilityKeys, ExplainabilityValues[ExplainabilityKeys]>;
  probFailure: number;
  events: List<string>;
}

type ProbableCauseType = Map<ProbableCauseSnapshotKeys, ProbableCauseSnapshotValues[ProbableCauseSnapshotKeys]>;

export type ExplainabilityKeys =
  | 'percentageFailedNotThroughRC'
  | 'numCallsInAggregationNotThroughRC'
  | 'incoming'
  | 'relevantSnapshotID'
  | 'numCallsInAggregationThroughRC'
  | 'connectedServiceId'
  | 'percentageFailedThroughRC';
export interface ExplainabilityValues {
  percentageFailedNotThroughRC: number;
  numCallsInAggregationNotThroughRC: number;
  incoming: boolean;
  relevantSnapshotID: string;
  numCallsInAggregationThroughRC: number;
  connectedServiceId: string;
  percentageFailedThroughRC: number;
}

export default function RootCauseSection({
  title,
  incident,
  incidentHasRCAProperty,
  latestSnapshot
}: RootCauseSectionProps) {
  const rootCauseSnapshotMap = incident.getIn(['metadata', 'rootCause'], Map()) as Map<string, ProbableCauseType>;
  const RCASnapshotIterator = useRef(
    rootCauseSnapshotMap.sort((a, b) => (b.get('probFailure') as number) - (a.get('probFailure') as number)).keys()
  ); // Iterator for going through snapshot IDs
  // State variable for holding the current snapshot ID
  const [currentRCAEntity, setCurrentRCAEntity] = useState<string | undefined>(undefined);

  useEffect(() => {
    setCurrentRCAEntity(RCASnapshotIterator.current.next().value);
  }, []);

  // Setter for choosing next entity - TO BE REMOVED ONCE WE SETUP FEEDBACK TO ALGORITHM
  const setNextEntity = () => {
    const { value, done } = RCASnapshotIterator.current.next();
    if (done) {
      RCASnapshotIterator.current = rootCauseSnapshotMap.keys();
      setCurrentRCAEntity(RCASnapshotIterator.current.next().value);
    } else {
      setCurrentRCAEntity(value);
    }
  };

  if (!currentRCAEntity) return <LoadingIndicator />;

  const rcaEntityID = rootCauseSnapshotMap.getIn([currentRCAEntity, 'entityID']);
  const explainabilityList = rootCauseSnapshotMap.getIn([currentRCAEntity, 'explainability']);
  const probFailure = rootCauseSnapshotMap.getIn([currentRCAEntity, 'probFailure']);
  const associatedEvents = rootCauseSnapshotMap.getIn([currentRCAEntity, 'events']);
  const entityType = determineEntityTypeFromEntityIDMap(rcaEntityID);

  if (!incidentHasRCAProperty) return null;
  return (
    <ProbableRootCauseCard title={title} incident={incident} currentRCAEntity={currentRCAEntity}>
      <RootCauseEntityDetails
        relatedAPID={
          (incident.get('metadata') as Map<string, string>).has('app20ApplicationId')
            ? (incident.get('metadata') as Map<string, string>).get('app20ApplicationId')
            : null
        }
        rcaSnapshotID={entityType === 'infrastructure' ? currentRCAEntity : rcaEntityID.get('steadyId')}
        rcaEntityType={entityType}
        explainabilityMetadata={explainabilityList}
        probabilityScore={probFailure}
        setNextEntity={setNextEntity}
        numOfSnapshots={rootCauseSnapshotMap.size}
        incidentTimeWindow={getIncidentTimeConfig(incident)}
      />
      <AssociatedEvents associatedEvents={associatedEvents} latestSnapshot={latestSnapshot} />
    </ProbableRootCauseCard>
  );
}

interface ProbableRootCauseCardProps {
  title: string;
  incident: EventOrMap;
  currentRCAEntity: string;
  children: ReactNode;
}

function ProbableRootCauseCard({ title, incident, currentRCAEntity, children }: ProbableRootCauseCardProps) {
  const [feedbackState, setFeedbackState] = useState<FeedbackStateType>({ default: defaultFeedbackState });

  useEffect(() => {
    if (currentRCAEntity && !feedbackState[currentRCAEntity])
      setFeedbackState({ ...feedbackState, [currentRCAEntity]: defaultFeedbackState });
  }, [currentRCAEntity, feedbackState]);

  return (
    <Row withoutSideMargin>
      <Col xs>
        <div className={locals.cardIndicator} />
        <Card
          title={title}
          leftHeaderContent={
            <Stack direction="horizontal" gap="xxsmall">
              <Tooltip align="topRight" content={t('in-events:RCA.performanceConstantlyEvaluated')}>
                <Pill type="blue" className={locals.techPreviewPill}>
                  {t('in-events:RCA.techPreview')}
                </Pill>
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
                snapshotMetadata={incident.getIn(['metadata', 'rootCause', currentRCAEntity])}
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

interface AssociatedEventsProps {
  associatedEvents: List<string>;
  latestSnapshot: Snapshot;
}

function AssociatedEvents({ associatedEvents, latestSnapshot }: AssociatedEventsProps) {
  const [associatedEventsObservables, setAssociatedEventsObservables] = useState<Observable<EventOrMap[]> | null>(null);

  const associatedEventsData = useObservable(associatedEventsObservables, [associatedEventsObservables]);

  useEffect(() => {
    setAssociatedEventsObservables(combineLatest(associatedEvents.toArray().map(getEvent)));
  }, [associatedEvents]);

  if (!associatedEventsData) return <LoadingIndicator />;

  return (
    <ExpandableLightCard
      title={t('in-events:RCA.relatedEventsLabel', {
        number_of_events: Array.isArray(associatedEventsObservables) ? associatedEventsObservables.length : 0
      })}
      darkFrame
    >
      {associatedEventsData?.map((_event: EventOrMap) => (
        <div onClick={expandedRCAEventCardTracker}>
          <EventListItem
            key={_event.get('id') as string}
            triggeringProblemId={
              associatedEventsData.length > 0 ? (associatedEventsData[0].get('id') as string) : undefined
            }
            event={_event}
            latestSnapshot={latestSnapshot}
            setBackground={themes.default.ids.color.option['deep-purple'][500]}
            setIconColor={themes.default.ids.color.option.white}
          />
        </div>
      ))}
    </ExpandableLightCard>
  );
}

function determineEntityTypeFromEntityIDMap(entityID: Map<string, string>) {
  const pluginName = translateFullyQualifiedPluginToShortPluginName(entityID.get('pluginId'));

  if (pluginName === 'application' || pluginName === 'service' || pluginName === 'endpoint') return pluginName;

  return 'infrastructure';
}

function getIncidentTimeConfig(incident: EventOrMap): TimeConfig {
  return {
    windowSize:
      (incident.get('end') as number) - incident.getIn(['metadata', 'triggeringTime'], 0) + minutes.toMillis(20) ||
      (incident.get('end') as number) - (incident.get('start') as number) + minutes.toMillis(20),
    to: incident.get('end') as number,
    focusedMoment:
      (incident.get('end') as number) - incident.getIn(['metadata', 'triggeringTime'], 0) + minutes.toMillis(20) ||
      (incident.get('end') as number) - (incident.get('start') as number) + minutes.toMillis(20),
    autoRefresh: false
  };
}

interface FeedbackStateType {
  [index: string]: {
    thumbsDown: boolean;
    thumbsUp: boolean;
  };
}

interface FeedbackComponentProps {
  feedbackState: FeedbackStateType;
  setFeedbackState: React.Dispatch<React.SetStateAction<FeedbackStateType>>;
  incident: EventOrMap;
  snapshotMetadata: Map<string, string>;
  currentEntity: any;
}

function FeedbackComponent({
  feedbackState,
  setFeedbackState,
  incident,
  snapshotMetadata,
  currentEntity
}: FeedbackComponentProps) {
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
          helpfulRCASuggestionTracker({});
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
          unhelpfulRCASuggestionTracker({});
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

function extractFeedbackMetadataFromIncident(incident: EventOrMap, snapshotMetadata: Map<string, string>) {
  let entityType = '';

  const metrics = incident.getIn(['metadata', 'metrics']) ?? List();

  const metricInfo = metrics
    .map((metricObject: Map<string, string>) => {
      return metricObject.get('metricName');
    })
    .toArray();
  if (snapshotMetadata && snapshotMetadata.has('entityID')) entityType = snapshotMetadata.get('entityID');

  return { entityType, metricInfo };
}
