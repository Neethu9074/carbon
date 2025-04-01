/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';

import { Card, Stack, Typography, Collapsible, CarbonLayer, IconButton } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import LegacyRootCauseSection from 'in-events/components/RootCauseAnalysis/Legacy/LegacyRootCauseSection';
import IncidentActions from 'in-events/components/IncidentPage/IncidentOverview/IncidentActions';
import RelatedEvents from 'in-events/components/IncidentPage/RelatedEvents/RelatedEvents';
import { getEventViewWithTimeFocusedAt } from 'in-events/components/legacy/EventListItem';
import { CombinedEventListItemContent } from 'in-events/components/legacy/EventListItem';
import ImpactedBusinessProcesses from 'in-events/components/ImpactedBusinessProcesses';
import RootCauseSection from 'in-events/components/RootCauseAnalysis/RootCauseSection';
import AutomationCardForPRC from 'in-automation/AutomationCard/AutomationCardForPRC';
import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import EventEntityDetails from 'in-events/components/legacy/EventEntityDetails';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import EventDetailsKPIs from 'in-events/components/EventDetailsKPIs';
import { FeedbackComponents } from 'in-events/components/EventTable';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { eventFeedbackEnabled } from 'in-services/featureFlags';
import { toHtml } from 'in-services/formatters/markdown';
import { rcaUIEnabled } from 'in-services/featureFlags';
import { Row, Col } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getEventType } from 'in-stores/events';
import { getEvent } from 'in-stores/events';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './EventList.mless';

export default function IncidentEventList({ incident, latestSnapshot, snapshot }) {
  const triggeringEvent = useObservable(getEvent(incident.getIn(['triggeringEvent'], '')), [incident]) ?? null;
  const triggeringEventId = triggeringEvent?.get('id') || '';

  const [scrolled, setScrolled] = useState(false);
  const rcaSectionRef = useRef();

  const incidentHasRCAProperty =
    incident.hasIn(['metadata', 'probableRootCause']) && !incident.getIn(['metadata', 'probableRootCause']).isEmpty();

  const triggeringProblemId = incident.getIn(['problem', 'id']);

  const eventType = getEventType(incident);
  const rootCauseHasOldSnapshotMetadata = incident.hasIn([
    'metadata',
    'rootCause',
    'probableRootCauseSnapshotMetadata'
  ]);

  const { location } = useNavigation();

  useEffect(() => {
    const scrollToParam = getMatrixParameter(location, [eventsPath], 'scrollTo');
    if (scrollToParam === 'rca') {
      if (rcaSectionRef.current && !scrolled) {
        rcaSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        setScrolled(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!triggeringEvent) return <LoadingIndicator />;
  return (
    <>
      {/* Event Details KPIs */}
      <EventDetailsKPIs event={incident} isIncident />

      {/* Incident overview */}
      <IncidentOverview
        incident={incident}
        triggeringEvent={triggeringEvent}
        latestSnapshot={latestSnapshot}
        triggeringProblemId={triggeringProblemId}
        triggeringEventId={triggeringEventId}
      />

      {/* RCA */}
      {incidentHasRCAProperty && rcaUIEnabled && rootCauseHasOldSnapshotMetadata && (
        <LegacyRootCauseSection
          title={t('in-events:RCA.titlePRCA')}
          incident={incident}
          latestSnapshot={latestSnapshot}
          incidentHasRCAProperty={incidentHasRCAProperty}
        />
      )}

      {rcaUIEnabled && !rootCauseHasOldSnapshotMetadata && (
        <RootCauseSection incident={incident} rcaRef={rcaSectionRef} />
      )}
      {/* Automations */}

      {rcaUIEnabled && !rootCauseHasOldSnapshotMetadata ? (
        <AutomationCardForPRC
          volatileId={snapshot?.get('volatileId')?.toJS() ?? {}}
          incident={incident}
          event={triggeringEvent?.toJS()}
        />
      ) : (
        <AutomationCard volatileId={snapshot?.get('volatileId')?.toJS() ?? {}} event={triggeringEvent?.toJS()} />
      )}

      {/* Business impact */}
      <ImpactedBusinessProcesses
        eventType={eventType}
        entityType={incident?.get('entityType', undefined)}
        entityId={incident?.get('entityId', undefined)}
      />
    </>
  );
}

const IncidentOverview = ({ incident, triggeringEvent, latestSnapshot, triggeringProblemId, triggeringEventId }) => {
  const colourForCard = getTriggeringEventCardColor(incident);
  const { location, createHref } = useNavigation();
  const { windowSize } = useTimeConfig();
  const timeConfigLink = createHref(
    getEventViewWithTimeFocusedAt(incident.get('start'), windowSize, location, incident.get('id'), incident.get('type'))
  );

  return (
    <Row withoutSideMargin>
      <Col xs>
        {colourForCard && <div className={locals.cardIndicator} style={{ background: colourForCard }} />}
        <Card
          useMaxAvailableHeight={false}
          title={t('in-events:incident.overviewTitle')}
          rightHeaderContent={
            <>
              <IconButton
                kind="subtle"
                data-testid="restroreConfigButton"
                type="lib_datetime_time"
                isWrapperedByTooltip
                iconDescription={t('in-events:incident.setTimeConfig')}
                href={timeConfigLink}
                align="left"
                iconSize="xs"
              />
            </>
          }
        >
          <TriggeringEvent incident={incident} triggeringEvent={triggeringEvent} latestSnapshot={latestSnapshot} />
        </Card>
        {/* Metric violations */}
        <MetricViolations triggeringEvent={triggeringEvent} latestSnapshot={latestSnapshot} incident={incident} />
        {/* Related events */}

        <RelatedEvents
          incident={incident}
          triggeringProblemId={triggeringProblemId}
          latestSnapshot={latestSnapshot}
          triggeringEventId={triggeringEventId}
        />
        {eventFeedbackEnabled && incident && (
          <div className={locals.feedbackContainer}>
            <FeedbackComponents iconSize="xs" eventData={incident} />
          </div>
        )}
      </Col>
    </Row>
  );
};

const TriggeringEvent = ({ incident, triggeringEvent, latestSnapshot }) => {
  const canCloseManually = role?.canManuallyCloseIssue;
  const timeConfig = canCloseManually && incident ? getTimeConfigForSnapshotRetrieval(incident, latestSnapshot) : null;

  return (
    <Stack gap="xsmall">
      <Typography variant="heading-200">{t('in-events:titleTriggerEvent')}</Typography>
      <Stack direction="horizontal" align="center">
        <div className={locals.noShrink} style={{ flexShrink: 0 }}>
          <Typography variant="heading-100" noMargin>
            {t('in-events:titleDescription')}:
          </Typography>
        </div>
        <DangerousHtmlPresenter
          className={locals.descriptionText}
          html={toHtml(triggeringEvent.getIn(['problem', 'fixSuggestion']))}
        />
      </Stack>
      <Stack direction="horizontal" align="center">
        <Typography variant="heading-100" noMargin>
          {t('in-events:incident.triggeringEntity')}:
        </Typography>
        <EventEntityDetails
          shouldDisplayDefaultLabel={false}
          triggeringEvent={triggeringEvent}
          timeConfig={timeConfig}
        />
      </Stack>
      <Stack direction="horizontal" align="center">
        {/* Incident actions */}
        <IncidentActions incident={incident} triggeringEvent={triggeringEvent} latestSnapshot={latestSnapshot} />
      </Stack>
    </Stack>
  );
};

const MetricViolations = ({ triggeringEvent, latestSnapshot, incident }) => {
  const rcaFound = incident.getIn(['rca', 'found'], false);
  return (
    <div className={locals.layerBackground}>
      <CarbonLayer>
        {/* TODO: determine if RCA is valid, if valid, hide the chart */}
        <Collapsible initiallyOpen={!rcaFound}>
          <Collapsible.Header>{t('in-events:incident.metricViolationTitle')}</Collapsible.Header>
          <Collapsible.Content>
            <div className={locals.accordionContent}>
              <CombinedEventListItemContent event={triggeringEvent} latestSnapshot={latestSnapshot} justChart />
            </div>
          </Collapsible.Content>
        </Collapsible>
      </CarbonLayer>
    </div>
  );
};

function getTriggeringEventCardColor(incident) {
  const incidentSeverity = incident ? incident.getIn(['problem', 'severity'], 5) : null;
  const incidentStatus = incident ? incident.get('state', 'closed') : null;

  let colorForCard;

  if (incidentStatus === 'closed' || incidentStatus === 'manually_closed') {
    colorForCard = themes.default.ids.color.option.neutral[500];
  } else if (incidentSeverity === 5) {
    colorForCard = themes.default.ids.color.option.yellow[500];
  } else if (incidentSeverity > 5) {
    colorForCard = themes.default.ids.color.option.red[500];
  }
  return colorForCard;
}
