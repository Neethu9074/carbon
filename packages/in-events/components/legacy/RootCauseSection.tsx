/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { List, Map } from 'immutable';

import {
  CarbonTab,
  CarbonTabList,
  CarbonTabPanel,
  CarbonTabPanels,
  CarbonTabs,
  Card,
  IconButton,
  Pill,
  Stack,
  Typography
} from '@instana/components';
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
// Typescript Probable Root Cause Reference
type ProbableCauseSnapshotKeys = 'entityID' | 'explainability' | 'probFailure' | 'events';
interface ProbableCauseSnapshotValues {
  entityID: Map<string, string>;
  explainability: List<Map<ExplainabilityKeys, ExplainabilityValues[ExplainabilityKeys]>>;
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
  const rootCauseSnapshotPath = incident.hasIn(['metadata', 'rootCause', 'currentRootCause'])
    ? ['metadata', 'rootCause', 'currentRootCause']
    : ['metadata', 'rootCause'];

  const rootCauseSnapshotMap = (incident.getIn(rootCauseSnapshotPath, Map()) as Map<string, ProbableCauseType>).sort(
    (a, b) => (b.get('probFailure') as number) - (a.get('probFailure') as number)
  );

  const rootCauseSnapshots = rootCauseSnapshotMap.entrySeq().toArray();

  if (!incidentHasRCAProperty || rootCauseSnapshotMap.size <= 0) return null;
  return (
    <ProbableRootCauseCard title={title} incident={incident}>
      <div>
        <CarbonTabs>
          <CarbonTabList aria-label="List of RCA Entities" contained>
            {rootCauseSnapshots.map(([rcaSnapshotID, rootCause], idx) => {
              if (!rootCause) return;

              const probFailureValue = rootCause.get('probFailure');

              let probText: string | undefined = undefined;
              if (probFailureValue >= 0.7) {
                probText = t('in-events:RCA.highProbabilitySecondaryLabel');
              } else if (probFailureValue >= 0.35) {
                probText = t('in-events:RCA.moderateProbabilitySecondaryLabel');
              } else {
                probText = t('in-events:RCA.lowProbabilitySecondaryLevel');
              }

              return (
                <CarbonTab key={rcaSnapshotID} secondaryLabel={probText}>
                  {idx === 0 ? t('in-events:RCA.mostLikelyCause') : t('in-events:RCA.probableCause')}
                </CarbonTab>
              );
            })}
          </CarbonTabList>
          <CarbonTabPanels>
            {rootCauseSnapshots.map(([rcaSnapshotID, rootCause], idx) => {
              if (!rootCause) return;

              return (
                <CarbonTabPanel className={locals.tabPanel} style={{ background: themes.default.cds.field['02'] }}>
                  <RootCauseEntityDetails
                    relatedAPID={
                      (incident.get('metadata') as Map<string, string>).has('app20ApplicationId')
                        ? (incident.get('metadata') as Map<string, string>).get('app20ApplicationId')
                        : null
                    }
                    rcaSnapshotID={
                      determineEntityTypeFromEntityIDMap(rootCause.get('entityID') as Map<string, string>) ===
                      'infrastructure'
                        ? rcaSnapshotID
                        : rootCause?.getIn(['entityID', 'steadyId'])
                    }
                    rcaEntityType={determineEntityTypeFromEntityIDMap(rootCause.get('entityID') as Map<string, string>)}
                    entityID={rootCause.get('entityID') as Map<string, string>}
                    explainabilityMetadata={
                      rootCause.get('explainability') as List<Map<ExplainabilityKeys, string | number | boolean>>
                    }
                    probabilityScore={rootCause.get('probFailure') as number}
                    incidentTimeWindow={getIncidentTimeConfig(incident)}
                    key={idx}
                  />
                  <div className={locals.sectionLine} /> {/* SectionLine component has too big of a bottom margin :( */}
                  <AssociatedEvents
                    associatedEvents={rootCause.get('events') as List<string>}
                    latestSnapshot={latestSnapshot}
                  />
                </CarbonTabPanel>
              );
            })}
          </CarbonTabPanels>
        </CarbonTabs>
      </div>
    </ProbableRootCauseCard>
  );
}

interface ProbableRootCauseCardProps {
  title: string;
  incident: EventOrMap;
  children: ReactNode;
}

function ProbableRootCauseCard({ title, children, incident }: ProbableRootCauseCardProps) {
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
                  {t('in-events:RCA.publicPreview')}
                </Pill>
              </Tooltip>
              <Pill type="purple" className={locals.rcaAIPill}>
                {t('in-events:RCA.AIGenBadgeText')}
              </Pill>
            </Stack>
          }
        >
          <Stack>
            {children}

            <FeedbackComponent incident={incident} />
          </Stack>
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
  const [expanded, setExpanded] = useState<boolean>(false);

  const associatedEventsData = useObservable(associatedEventsObservables, [associatedEventsObservables]);

  useEffect(() => {
    setAssociatedEventsObservables(combineLatest(associatedEvents.toArray().map(getEvent)));
  }, [associatedEvents]);

  if (!associatedEventsData) return <LoadingIndicator />;

  return (
    <Card
      leftHeaderContent={
        <Typography variant="body-bold">
          {t('in-events:RCA.relatedEventsLabel', {
            number_of_events: Array.isArray(associatedEventsData) ? associatedEventsData.length : 0
          })}
        </Typography>
      }
      onHeaderBackgroundClicked={() => setExpanded(!expanded)}
      headerClassName={locals.associatedEventsCardHeader}
      rightHeaderContent={
        <IconButton color="black" type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} size="compact" />
      }
      className={locals.associatedEventsCard}
      hasMarginBottom={expanded}
      useMaxAvailableHeight={false}
    >
      {expanded &&
        associatedEventsData?.map((_event: EventOrMap) => (
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
    </Card>
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

interface FeedbackComponentProps {
  incident: EventOrMap;
}

function FeedbackComponent({ incident }: FeedbackComponentProps) {
  const [thumbsDown, setThumbsDown] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);

  return (
    <Stack direction="horizontal" gap="small" align="center">
      {thumbsDown || thumbsUp ? (
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
          setThumbsUp(true);
        }}
      />
      <IconButton
        kind="action"
        size="xl"
        type="lib_thumbs_down"
        iconSize="xs"
        onClick={() => {
          unhelpfulRCASuggestionTracker({});
          addActiveDialog(
            <EventFeedbackDialog
              stepConfig={rcaStepConfig}
              nextStepTracker={RCAFeedbackNextTracker}
              skipStepTracker={RCAFeedbackSkipTracker}
              closedManuallyTracker={RCAFeedbackClosedManuallyTracker}
              submitTracker={RCAFeedbackSubmitTracker}
              submitMetadata={{ incident }}
            />
          );
          setThumbsDown(true);
        }}
      />
    </Stack>
  );
}
