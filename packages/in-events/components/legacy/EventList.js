/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { get } from 'lodash';

import {
  Card,
  Stack,
  Typography,
  Collapsible,
  CarbonLayer,
  IconButton,
  CarbonButton,
  SvgIcon
} from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  notesAndActivityEnabled,
  rcaUIEnabled,
  relatedEventsDatgridEnabled,
  businessObservabilityEnabled,
  eventFeedbackEnabled,
  rcaAgenticEnabled
} from 'in-services/featureFlags';
import AgenticInvestigationWorkflow from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/AgenticInvestigation';
import { InfraAggregatedEntitiesTablePresenter } from 'in-events/components/EventContent/InfraAggregatedEntities';
import { getTimeConfigForAggregatedEntitiesTable } from 'in-events/components/EventContent/InfraEventContent';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import RelatedEventsOptimized from 'in-events/components/IncidentPage/RelatedEvents/RelatedEventsOptimized';
import IncidentActions from 'in-events/components/IncidentPage/IncidentOverview/IncidentActions';
import { getExpressionWithGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import RelatedEvents from 'in-events/components/IncidentPage/RelatedEvents/RelatedEvents';
import { getEventViewWithTimeFocusedAt } from 'in-events/components/legacy/EventListItem';
import { CombinedEventListItemContent } from 'in-events/components/legacy/EventListItem';
import { handleTracking } from 'in-events/components/NotesAndActivity/components/utils';
import ImpactedBusinessProcesses from 'in-events/components/ImpactedBusinessProcesses';
import RootCauseSection from 'in-events/components/RootCauseAnalysis/RootCauseSection';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { EVENT_AI_GENERATE_SUBMIT_OVERVIEW } from 'in-services/tracking/eventNames';
import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import EventListProviders from 'in-events/components/providers/EventListProviders';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import EventEntityDetails from 'in-events/components/legacy/EventEntityDetails';
import useInfraEventAlertConfig from 'in-events/hooks/useInfraEventAlertConfig';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isInfraSmartAlertEvent } from 'in-events/components/eventUtil';
import { MoveAIChatLauncher } from 'in-events/components/AIChat/AIChat';
import EventDetailsKPIs from 'in-events/components/EventDetailsKPIs';
import { FeedbackComponents } from 'in-events/components/EventTable';
import { summaryNotes$, setSummaryNotes } from 'in-stores/incidents';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { toHtml } from 'in-services/formatters/markdown';
import { emptyMap } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { deepCopy } from 'in-services/util/object';
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

  const triggeringProblemId = incident.getIn(['problem', 'id']);

  const eventType = getEventType(incident);
  const hasRootCauses = incident.getIn(['metadata', 'rootCause', 'found']) ?? false;

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
    <EventListProviders incident={incident}>
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

      {/* Without Agentic investigation */}
      {rcaUIEnabled && hasRootCauses && <RootCauseSection incident={incident} rcaRef={rcaSectionRef} />}

      {/* Automations - display both recommended actions and history when no PRC is present*/}
      {rcaUIEnabled && !hasRootCauses && (
        <AutomationCard volatileId={snapshot?.get('volatileId')?.toJS() ?? {}} event={triggeringEvent?.toJS()} />
      )}

      {/* Business impact */}
      {businessObservabilityEnabled && (
        <ImpactedBusinessProcesses
          eventType={eventType}
          entityType={incident?.get('entityType', undefined)}
          entityId={incident?.get('entityId', undefined)}
        />
      )}

      {/* With agentic investigation Workflow */}
      {rcaAgenticEnabled && hasRootCauses && (
        <AgenticInvestigationWorkflow
          incident={incident}
          volatileId={snapshot?.get('volatileId')?.toJS() ?? {}}
          rcaRef={rcaSectionRef}
          event={triggeringEvent?.toJS()}
        />
      )}
      {/* Display Incident action history  separately when PRC ise present*/}
      {rcaAgenticEnabled && hasRootCauses && (
        <AutomationCard volatileId={snapshot?.get('volatileId')?.toJS() ?? {}} event={triggeringEvent?.toJS()} hasRCA />
      )}
    </EventListProviders>
  );
}

const IncidentOverview = ({ incident, triggeringEvent, latestSnapshot, triggeringProblemId, triggeringEventId }) => {
  const colourForCard = getTriggeringEventCardColor(incident);
  const { location, createHref } = useNavigation();
  const { windowSize } = useTimeConfig();
  const timeConfigLink = createHref(
    getEventViewWithTimeFocusedAt(incident.get('start'), windowSize, location, incident.get('id'), incident.get('type'))
  );
  // From the summaryNotes store we get the "open" value
  const summaryOpen = useObservable(summaryNotes$, [summaryNotes$])?.open || false;

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
          leftHeaderContent={
            notesAndActivityEnabled && (
              <CarbonButton
                kind={'tertiary'}
                className={locals.actionsButton}
                size={'sm'}
                id="generate_summary_ai_header"
                disabled={summaryOpen}
                renderIcon={() => {
                  return <SvgIcon type={'lib_generate_ai'} color="currentColor" size="xs" id="ai_summary_loading" />;
                }}
                onClick={() => {
                  // Open notes, generate summary
                  setSummaryNotes(true, true);
                  MoveAIChatLauncher('500px');
                  handleTracking(incident.get('id'), EVENT_AI_GENERATE_SUBMIT_OVERVIEW);
                }}
              >
                <div className={locals.generateSummaryButtonContents}>{t('in-events:notes.generateSummary')}</div>
              </CarbonButton>
            )
          }
        >
          <TriggeringEvent incident={incident} triggeringEvent={triggeringEvent} latestSnapshot={latestSnapshot} />
        </Card>
        {isInfraSmartAlertEvent(incident) && <AggregatedInfraEntities incident={incident} />}
        {/* Metric violations */}
        <MetricViolations triggeringEvent={triggeringEvent} latestSnapshot={latestSnapshot} incident={incident} />
        {/* Related events */}

        {relatedEventsDatgridEnabled ? (
          <RelatedEventsOptimized incident={incident} triggeringEventId={triggeringEventId} />
        ) : (
          <RelatedEvents
            incident={incident}
            triggeringProblemId={triggeringProblemId}
            latestSnapshot={latestSnapshot}
            triggeringEventId={triggeringEventId}
          />
        )}
        {eventFeedbackEnabled && incident && (
          <div className={locals.feedbackContainer}>
            <FeedbackComponents iconSize="xs" eventData={incident} />
          </div>
        )}
      </Col>
    </Row>
  );
};

const AggregatedInfraEntities = ({ incident }) => {
  const alertConfig = useInfraEventAlertConfig(incident);
  const entityType = alertConfig?.rule?.entityType ?? 'all';
  const metricName = incident.getIn(['metadata', 'smartAlertInfo', 'metricName'], '');
  const aggregation = incident.getIn(['metadata', 'smartAlertInfo', 'metricAggregation'], '');
  const groupingTags = incident.getIn(['metadata', 'groupingTags'], emptyMap).toJS();
  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);
  const [aggregatedEntitiesOpen, setAggregatedEntitiesOpen] = useState(true);
  const tagFilterExpression = alertConfig?.tagFilterExpression;
  const [ruleWithThreshold] = alertConfig?.rules ?? [];
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  const alertConfigWithGroupingExpression = {
    ...alertConfig,
    tagFilterExpression: {
      ...getExpressionWithGroupingTags(deepCopy(tagFilterExpression), groupingTags)
    }
  };

  if (alertConfig?.evaluationType !== 'CUSTOM') {
    return null;
  }

  return (
    <div className={locals.layerBackground}>
      <CarbonLayer>
        <InfraAggregatedEntitiesTablePresenter
          tagFilterFormModel={tagFilterFormModel}
          timeConfig={getTimeConfigForAggregatedEntitiesTable(incident, alertConfigWithGroupingExpression.granularity)}
          ruleWithThreshold={ruleWithThreshold}
          tagFilterExpression={alertConfigWithGroupingExpression.tagFilterExpression}
          metricLabel={metricLabel}
          aggregatedEntitiesOpen={aggregatedEntitiesOpen}
          setAggregatedEntitiesOpen={setAggregatedEntitiesOpen}
        />
      </CarbonLayer>
    </div>
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
