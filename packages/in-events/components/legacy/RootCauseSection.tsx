/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode, useState } from 'react';
import { List, Map } from 'immutable';

import {
  Button,
  CarbonTab,
  CarbonTabList,
  CarbonTabPanel,
  CarbonTabPanels,
  CarbonTabs,
  Card,
  IconButton,
  Pill,
  PreviewPill,
  Stack,
  SvgIcon,
  Typography
} from '@instana/components';
import { Snapshot, TimeConfig } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { t, Trans } from '@instana/i18n-react';
import { fromNow } from '@instana/format-date';

import {
  EVENT_RCA_SUGGESTION_HELPFUL,
  EVENT_RCA_SUGGESTION_UNHELPFUL,
  EVENT_RCA_FEEDBACK_NEXT,
  EVENT_FEEDBACK_SKIP,
  EVENT_RCA_FEEDBACK_CLOSED_MANUALLY,
  EVENT_RCA_FEEDBACK_SUBMIT
} from 'in-services/tracking/tracking';
import { ExplainabilityKeys, ProbableCauseType } from 'in-events/components/util/rootCauseUtil';
import RootCauseEntityDetails from 'in-events/components/legacy/RootCauseEntityDetails';
import { carbonButtonEnabled, rcaFailedStateEnabled } from 'in-services/featureFlags';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import EventFeedbackDialog from 'in-events/components/feedback/EventFeedbackDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { rcaStepConfig } from 'in-events/components/feedback/rcaStepConfig';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { useLinkToAnalyze } from 'in-applications/navigation/paths';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { minutes } from 'in-services/time/time';
import { EventOrMap } from 'in-events/types';
import { Nullish } from 'in-types';

import locals from 'in-events/components/legacy/EventList.mless';

interface RootCauseSectionProps {
  title: string;
  incident: EventOrMap;
  latestSnapshot: Snapshot;
}

export default function RootCauseSection({ title, incident, latestSnapshot }: RootCauseSectionProps) {
  const rootCauseSnapshotPath = incident.hasIn(['metadata', 'rootCause', 'currentRootCause'])
    ? ['metadata', 'rootCause', 'currentRootCause']
    : ['metadata', 'rootCause'];

  const failureReason = incident.getIn(['rca', 'failureReason']);

  const getLinkToApplicationAnalyze = useLinkToAnalyze();

  const rootCauseSnapshotMap = (
    incident.getIn(rootCauseSnapshotPath, Map()) as Map<string, ProbableCauseType> | List<ProbableCauseType>
  )
    .sort(
      (a: ProbableCauseType, b: ProbableCauseType) =>
        (b.get('probFailure') as number) - (a.get('probFailure') as number)
    )
    .filter((rootCauseEntity: ProbableCauseType | undefined) => {
      // Filtering out entities with no erroneous rate through the identified root cause
      if (!rootCauseEntity) return false;

      const explainabilityMetadata = rootCauseEntity.get('explainability') as List<
        Map<string, string | number | boolean>
      >;
      const aggreagatedInfo = explainabilityMetadata.find(service => service?.get('connectedServiceId') === 'all');

      if (aggreagatedInfo.get('percentageFailedThroughRC') === 0) {
        return false;
      }
      return true;
    });

  let rootCauseSnapshots: [string, ProbableCauseType][] = [];
  if (List.isList(rootCauseSnapshotMap)) {
    rootCauseSnapshots = rootCauseSnapshotMap
      .map((rootCause: ProbableCauseType | undefined) => {
        if (!rootCause) return;
        const id = rootCause?.get('snapshotId');

        return [id, rootCause];
      })
      .toArray() as [string, ProbableCauseType][];
  } else if (Map.isMap(rootCauseSnapshotMap)) {
    // legacy where we had a map of snapshot Ids with respective root cause directly
    rootCauseSnapshots = rootCauseSnapshotMap.entrySeq().toArray() as [string, ProbableCauseType][];
  }

  if (rootCauseSnapshotMap.size <= 0 && rcaFailedStateEnabled) {
    let failedTextReason;
    let externalLink;
    let buttonText;
    if (failureReason) {
      if (failureReason === 'no_calls_after_filter' || failureReason === 'no_calls') {
        const incidentStartTime = new Date(incident.get('start') as number);
        failedTextReason = (
          <Trans
            i18nKey="in-events:RCA.failureReasons.noCalls"
            components={{
              time_since_event_started: fromNow(incidentStartTime)
            }}
            parent="span"
          />
        );
        externalLink = getLinkToApplicationAnalyze({});
        buttonText = t('in-events:RCA.failureReasons.analyzePage');
      } else if (failureReason === 'not_enough_application_impact') {
        failedTextReason = t('in-events:RCA.failureReasons.notEnoughApplicationImpact');
        externalLink =
          'https://www.ibm.com/docs/en/instana-observability/current?topic=applications-application-perspectives';
        buttonText = t('in-events:RCA.failureReasons.viewDocumentation');
      }
    } else {
      failedTextReason = t('in-events:RCA.failureReasons.notSupported');
      externalLink = 'https://www.ibm.com/docs/en/instana-observability/current?topic=ma-smart-alerts';
      buttonText = t('in-events:RCA.failureReasons.viewDocumentation');
    }

    return (
      <ProbableRootCauseCard title={title}>
        <div className={locals.innerRCACard}>
          <Stack>
            <SvgIcon type="lib_carbon_empty_state" size="xxl" />
            <div className={locals.failureTextWrapper}>
              <Typography variant="heading-compact-02">{t('in-events:RCA.failedTitle')}</Typography>
            </div>
            <div className={locals.failureTextWrapper}>
              <Typography variant="body-regular">{t('in-events:RCA.failed')}</Typography>
            </div>
            {failedTextReason && (
              <div className={locals.failureTextWrapper}>
                <Typography variant="body-regular">{failedTextReason}</Typography>
              </div>
            )}
            {buttonText && (
              <Button
                icon={
                  buttonText === t('in-events:RCA.failureReasons.viewDocumentation')
                    ? 'lib_views_external_link'
                    : 'lib_analyze'
                }
                kind={carbonButtonEnabled ? 'tertiary' : 'secondary'}
                href={externalLink}
              >
                {buttonText}
              </Button>
            )}
          </Stack>
        </div>
      </ProbableRootCauseCard>
    );
  } else if (rootCauseSnapshotMap.size <= 0 && !rcaFailedStateEnabled) {
    return null;
  }
  return (
    <ProbableRootCauseCard title={title} incident={incident}>
      <div>
        <CarbonTabs>
          <CarbonTabList aria-label="List of RCA Entities" contained>
            {rootCauseSnapshots.map(([rcaSnapshotID, rootCause], idx) => {
              if (!rootCause) return;

              const probFailureValue = rootCause.get('probFailure') as number;

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
                <CarbonTabPanel
                  key={rcaSnapshotID}
                  className={locals.tabPanel}
                  style={{ background: themes.default.cds.field['02'] }}
                >
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
                    associatedEvents={rootCause.get('events') as List<string>}
                    latestSnapshot={latestSnapshot}
                    key={idx}
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
  incident?: EventOrMap;
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
                <PreviewPill className={locals.techPreviewPill} />
              </Tooltip>
              <Pill type="purple" className={locals.rcaAIPill}>
                {t('in-events:RCA.AIGenBadgeText')}
              </Pill>
            </Stack>
          }
        >
          <Stack>
            {children}
            {incident && <FeedbackComponent incident={incident} />}
          </Stack>
        </Card>
      </Col>
    </Row>
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
  incident: EventOrMap | Nullish;
}

function FeedbackComponent({ incident }: FeedbackComponentProps) {
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'root cause analysis';
  const { trackCta } = useSegmentTracking();

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
          trackCta(EVENT_RCA_SUGGESTION_HELPFUL, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
          setThumbsUp(true);
        }}
      />
      <IconButton
        kind="action"
        size="xl"
        type="lib_thumbs_down"
        iconSize="xs"
        onClick={() => {
          trackCta(EVENT_RCA_SUGGESTION_UNHELPFUL, {}, SEGMENT_EVENT_PROPERTY_CHANNEL);
          addActiveDialog(
            <EventFeedbackDialog
              stepConfig={rcaStepConfig}
              nextStepTracker={instrumentationEventProperties => {
                trackCta(EVENT_RCA_FEEDBACK_NEXT, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
              }}
              skipStepTracker={instrumentationEventProperties => {
                trackCta(EVENT_FEEDBACK_SKIP, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
              }}
              closedManuallyTracker={instrumentationEventProperties => {
                trackCta(
                  EVENT_RCA_FEEDBACK_CLOSED_MANUALLY,
                  instrumentationEventProperties,
                  SEGMENT_EVENT_PROPERTY_CHANNEL
                );
              }}
              submitTracker={instrumentationEventProperties => {
                trackCta(EVENT_RCA_FEEDBACK_SUBMIT, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
              }}
              submitMetadata={{ incident }}
            />
          );
          setThumbsDown(true);
        }}
      />
    </Stack>
  );
}
