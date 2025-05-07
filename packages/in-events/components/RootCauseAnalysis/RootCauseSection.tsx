/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode, Ref, memo, useMemo, useState } from 'react';
import { get, has, isEmpty, isNull } from 'lodash';

import {
  Button,
  CarbonSlug,
  CarbonSlugContent,
  CarbonTab,
  CarbonTabList,
  CarbonTabs,
  CarbonTile,
  IconButton,
  PreviewPill,
  Stack,
  SvgIcon,
  Typography
} from '@instana/components';
import { t, Trans } from '@instana/i18n-react';
import { fromNow } from '@instana/format-date';
import { Event } from '@instana/types';

import {
  EVENT_RCA_SUGGESTION_HELPFUL,
  EVENT_RCA_SUGGESTION_UNHELPFUL,
  EVENT_RCA_FEEDBACK_NEXT,
  EVENT_FEEDBACK_SKIP,
  EVENT_RCA_FEEDBACK_CLOSED_MANUALLY,
  EVENT_RCA_FEEDBACK_SUBMIT,
  EVENT_RCA_PANNEL_TAB_CLICK
} from 'in-services/tracking/tracking';
import determineEntityTypeFromEntityIDMap from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import getRootCauseTabSecondaryLabel from 'in-events/components/RootCauseAnalysis/utils/getRootCauseTabSecondaryLabel';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
import { RootCauseDataProvider } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import getRootCauseTabLabel from 'in-events/components/RootCauseAnalysis/utils/getRootCauseTabLabel';
import RootCauseLogsSection from 'in-events/components/RootCauseAnalysis/Logs/RootCauseLogsSection';
import RootCauseEntityDetails from 'in-events/components/RootCauseAnalysis/RootCauseEntityDetails';
import AssociatedEvents from 'in-events/components/RootCauseAnalysis/RootCauseAssociatedEvents';
import { trackRcaClick } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import EventFeedbackDialog from 'in-events/components/feedback/EventFeedbackDialog';
import { rcaFailedStateEnabled, rcaLogsEnabled } from 'in-services/featureFlags';
import { RootCause } from 'in-events/components/RootCauseAnalysis/utils/types';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { rcaStepConfig } from 'in-events/components/feedback/rcaStepConfig';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { useLinkToAnalyze } from 'in-applications/navigation/paths';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { EventOrMap } from 'in-events/types';
import { Nullish } from 'in-types';

import locals from 'in-events/components/legacy/EventList.mless';

interface RootCauseSectionProps {
  incident: EventOrMap;
  rcaRef: Ref<HTMLDivElement>;
}

const getRootCauses = (incident: Event) => {
  const path = has(incident, 'metadata.rootCause.currentRootCause')
    ? 'metadata.rootCause.currentRootCause'
    : 'metadata.rootCause';

  const rootCauses: RootCause[] = get(incident, path, []);
  return rootCauses
    .sort((a, b) => b.probFailure - a.probFailure)
    .filter(rootCause => {
      if (isEmpty(rootCause) || isNull(rootCause) || !has(rootCause, 'explainability')) {
        return false;
      }
      return rootCause.explainability.some(ex => ex.connectedServiceId === 'all' && ex.percentageFailedThroughRC !== 0);
    });
};

const RootCauseSection = ({ incident, rcaRef }: RootCauseSectionProps) => {
  const [rootCauseTab, setRootCauseTab] = useState(0);
  const { location } = useNavigation();
  const incidentJSON: Event = useMemo(() => incident.toJS(), [incident]);
  const rootCauses = useMemo(() => getRootCauses(incidentJSON), [incidentJSON]);

  const failureReason = get(incidentJSON, 'rca.failureReason');
  const getLinkToApplicationAnalyze = useLinkToAnalyze();

  if (rootCauses.length <= 0 && rcaFailedStateEnabled) {
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
      <ProbableRootCauseCard rcaRef={rcaRef}>
        <div className={locals.innerRCACard} ref={rcaRef}>
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
                kind="tertiary"
                href={externalLink}
              >
                {buttonText}
              </Button>
            )}
          </Stack>
        </div>
      </ProbableRootCauseCard>
    );
  } else if (rootCauses.length <= 0 && !rcaFailedStateEnabled) {
    return null;
  }

  return (
    <RootCauseDataProvider incident={incidentJSON}>
      <SelectedRootCauseContext.Provider
        value={{
          selectedRootCause: rootCauseTab,
          setSelectedRootCause: setRootCauseTab
        }}
      >
        <Row withoutSideMargin>
          <Col xs>
            <ProbableRootCauseCard rcaRef={rcaRef}>
              <div>
                <CarbonTabs
                  selectedIndex={rootCauseTab}
                  onChange={val => {
                    setRootCauseTab(val.selectedIndex ?? 0);
                    const probabilityScore = rootCauses[val.selectedIndex].probFailure;
                    const rcaEntityType = determineEntityTypeFromEntityIDMap(rootCauses[val.selectedIndex].entityID);
                    const rcaTrackingData = {
                      incident,
                      location,
                      rootCauseTab,
                      rcaEntityType,
                      probabilityScore
                    };
                    trackRcaClick({ ...rcaTrackingData, ctaEvent: EVENT_RCA_PANNEL_TAB_CLICK });
                  }}
                >
                  <CarbonTabList aria-label="List of RCA Entities" contained>
                    {rootCauses.map((rootCause, idx) => (
                      <CarbonTab key={rootCause.snapshotId} secondaryLabel={getRootCauseTabSecondaryLabel(rootCause)}>
                        {getRootCauseTabLabel(idx)}
                      </CarbonTab>
                    ))}
                  </CarbonTabList>
                </CarbonTabs>
                <RootCauseEntityDetails incident={incidentJSON} rootCauses={rootCauses} />
              </div>

              {!isNull(rootCauses[rootCauseTab]) && (
                <Stack gap="disabled">
                  {rcaLogsEnabled ? (
                    <RootCauseLogsSection incident={incidentJSON} rootCause={rootCauses[rootCauseTab]} />
                  ) : (
                    <></>
                  )}
                  <AssociatedEvents rootCause={rootCauses[rootCauseTab]} incident={incidentJSON} />
                  <div className={locals.accordionContent}>
                    <FeedbackComponent incident={incident} />
                  </div>
                </Stack>
              )}
            </ProbableRootCauseCard>
          </Col>
        </Row>
      </SelectedRootCauseContext.Provider>
    </RootCauseDataProvider>
  );
};

interface ProbableRootCauseCardProps {
  children: ReactNode;
  rcaRef: Ref<HTMLDivElement>;
}

const ProbableRootCauseCard = ({ children, rcaRef }: ProbableRootCauseCardProps) => (
  <CarbonTile
    ref={rcaRef}
    decorator={
      <CarbonSlug>
        <CarbonSlugContent>
          {t('in-events:RCA.performanceConstantlyEvaluated')}
          <Button
            kind="tertiary"
            icon="lib_views_external_link"
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=capabilities-root-cause-analysis#automatic-probable-root-cause-public-preview"
          >
            {t('in-events:RCA.failureReasons.viewDocumentation')}
          </Button>
        </CarbonSlugContent>
      </CarbonSlug>
    }
  >
    <Stack direction="horizontal">
      <Typography variant="heading-03">{t('in-events:RCA.titlePRCA')}</Typography>
      <PreviewPill />
    </Stack>
    <br />
    <Stack>{children}</Stack>
  </CarbonTile>
);

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

export default memo(RootCauseSection, (prevProps, nextProps) => prevProps.incident.id === nextProps.incident.id);
