/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  getSnapshotId,
  isEntityVerificationEvent,
  isHostAvailabilityEvent,
  isAgentMonitoringIssueEvent,
  isCveIssueEvent,
  isPrcIssueEvent,
  isApplicationSmartAlertEvent,
  isWebsiteSmartAlertEvent,
  isInfraSmartAlertEvent,
  isSyntheticSmartAlertEvent,
  getTimeConfigForSnapshotRetrieval,
  isIbmMqFileTransferIssueEvent,
  isMobileAppSmartAlertEvent,
  isSloSmartAlertEvent,
  isEntityCountVerificationEvent,
  isLogSmartAlertEvent,
  hasManualCloseFields,
  getEventStateBadge
} from 'in-events/components/eventUtil';
import EntityCountVerificationEventContent from 'in-events/components/EventContent/EntityCountVerificationEventContent';
import { KubernetesEventContent, isKubernetesEvent } from 'in-events/components/EventContent/KubernetesEventContent';
import IbmMqFileTransferMetadataTable from 'in-events/components/tabs/Summary/IbmMqFileTransferMetadataTable';
import { DeprecatedCustomEventWarning } from 'in-events/components/tabs/Summary/DeprecatedCustomEventWarning';
import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
import AgentMonitoringIssueDescription from 'in-events/components/legacy/AgentMonitoringIssueDescription';
import TriggeredIncidentButton from 'in-events/components/tabs/Summary/common/TriggeredIncidentButton';
import IncidentContent from 'in-events/components/tabs/Summary/IncidentDetailPage/IncidentContent';
import DisableEventConfigButton from 'in-events/components/tabs/Summary/DisableEventConfigButton';
import ApplicationEventContent from 'in-events/components/EventContent/ApplicationEventContent';
import ManualCloseIssueButton from 'in-events/components/tabs/Summary/ManualCloseIssueButton';
import SyntheticEventContent from 'in-events/components/EventContent/SyntheticEventContent';
import AffectedEntitiesPresenter from 'in-events/components/legacy/CveAffectedApplications';
import AnalyzeIssueCallsButton from 'in-events/components/legacy/AnalyzeIssueCallsButton';
import OfflineEventDescription from 'in-events/components/legacy/OfflineEventDescription';
import PrcIssueEventContent from 'in-events/components/EventContent/PrcIssueEventContent';
import WebsiteEventContent from 'in-events/components/EventContent/WebsiteEventContent';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import ManualCloseDescription from 'in-events/components/legacy/ManualCloseDescription';
import ImpactedBusinessProcesses from 'in-events/components/ImpactedBusinessProcesses';
import MobileEventContent from 'in-events/components/EventContent/MobileEventContent';
import InfraEventContent from 'in-events/components/EventContent/InfraEventContent';
import SubEntityInformation from 'in-events/components/legacy/SubEntityInformation';
import CveIssueDescription from 'in-events/components/legacy/CveIssueDescription';
import LogsEventContent from 'in-events/components/EventContent/LogEventContent';
import SloEventContent from 'in-events/components/EventContent/SloEventContent';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { aqmDisableConfigOnEventViewEnabled } from 'in-services/featureFlags';
import ProcessTopList from 'in-forge/plugins/host/Dashboard/ProcessTopList';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import EventDetailsKPIs from 'in-events/components/EventDetailsKPIs';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getEventType, EVENT_TYPES } from 'in-stores/events';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { pageNames } from 'in-services/tracking/pageNames';
import EventChart from 'in-events/components/EventChart';
import { emptyList } from 'in-services/fixedImmutables';
import EventIcon from 'in-events/components/EventIcon';
import { Row, Col } from 'in-components/layout/Grid';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary(props) {
  const { selectedEventId, data: event, reload } = props;
  const expiredSnapshotId = getSnapshotId(event, isEntityVerificationEvent(event));
  const expiredSnapshotVersions = useObservable(getSnapshotVersionsObservable, [expiredSnapshotId]);
  const latestSnapshot = expiredSnapshotVersions && getLatestSnapshot(expiredSnapshotVersions.toArray());

  if (!event || selectedEventId !== event.get('id')) {
    return <LoadingIndicator size="xxxl" style={{ height: '200px' }} />;
  }

  const eventType = getEventType(event);
  const isIncident = eventType === EVENT_TYPES.INCIDENT;

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.events,
          pageRootName: pageNames.event
        }}
      />
      <div className={locals.content}>
        <DeprecatedCustomEventWarning event={event.toJS()} isIncident={isIncident} />
        {isIncident ? (
          <IncidentContent incident={event} latestSnapshot={latestSnapshot} />
        ) : (
          <>
            <EventDetailsKPIs
              event={event}
              isIncident={isIncident}
              isApplicationSmartAlert={isApplicationSmartAlertEvent(event)}
            />
            <EventContent event={event} latestSnapshot={latestSnapshot} reload={reload} />
          </>
        )}
      </div>
    </>
  );
}

function EventContent({ event, latestSnapshot, reload }) {
  const entityID = event.get('entityId');
  const snapshot = useObservable(getSnapshot(entityID, getTimeConfigForSnapshotRetrieval(event, latestSnapshot)), [
    entityID
  ]);
  const timeConfig = getTimeConfigForSnapshotRetrieval(event, latestSnapshot);

  if (isWebsiteSmartAlertEvent(event)) {
    return <WebsiteEventContent event={event} snapshot={snapshot} reload={reload} />;
  }

  if (isApplicationSmartAlertEvent(event)) {
    return <ApplicationEventContent event={event} snapshot={snapshot} reload={reload} />;
  }

  // TODO: Confirm support
  if (isKubernetesEvent(event)) {
    return <KubernetesEventContent event={event} timeConfig={timeConfig} reload={reload} />;
  }

  if (isInfraSmartAlertEvent(event)) {
    return <InfraEventContent event={event} snapshot={snapshot} reload={reload} />;
  }

  if (isSyntheticSmartAlertEvent(event)) {
    return <SyntheticEventContent event={event} snapshot={snapshot} reload={reload} />;
  }

  if (isMobileAppSmartAlertEvent(event)) {
    return <MobileEventContent event={event} snapshot={snapshot} reload={reload} />;
  }

  if (isSloSmartAlertEvent(event)) {
    return <SloEventContent event={event} snapshot={snapshot} />;
  }

  if (isLogSmartAlertEvent(event)) {
    return <LogsEventContent event={event} snapshot={snapshot} reload={reload} />;
  }

  if (isEntityCountVerificationEvent(event)) {
    return <EntityCountVerificationEventContent event={event} snapshot={snapshot} reload={reload} />;
  }

  if (isPrcIssueEvent(event)) {
    return <PrcIssueEventContent event={event} />;
  }

  const eventType = getEventType(event);
  const isIssue = eventType === EVENT_TYPES.ISSUE_WARNING || eventType === EVENT_TYPES.ISSUE_CRITICAL;
  const hasEventSpec = event.getIn(['metadata', 'eventSpecificationId'], '') !== '';
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');

  const pillContent = getEventStateBadge(event);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')} leftHeaderContent={pillContent}>
            <EntityWithParentInformation
              entityId={entityID}
              entityType={event.get('entityType')}
              metadata={event.get('metadata')}
              timeConfig={timeConfig}
              linkTimeConfig={getTimeConfigFromEvent(event)}
            />
            <SubEntityInformation event={event} />
            {isAgentMonitoringIssueEvent(event) ? (
              <AgentMonitoringIssueDescription
                event={event}
                timeConfig={timeConfig}
                className="in-event-view-event-content"
              />
            ) : isCveIssueEvent(event) ? (
              <CveIssueDescription event={event} />
            ) : (
              <ProblemDescription fixSuggestion={fixSuggestion} />
            )}
            <EventActions event={event} reload={reload} latestSnapshot={latestSnapshot} />
          </Card>
        </Col>
      </Row>
      {isEntityVerificationEvent(event) || isHostAvailabilityEvent(event) ? (
        <Row withoutSideMargin>
          <Col xs>
            <Card
              title={isEntityVerificationEvent(event) ? t('in-events:titleLastProcess') : t('in-events:titleLastHost')}
            >
              <OfflineEventDescription event={event} latestSnapshot={latestSnapshot} />
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          {hasAtLeastOneMetric(event) && (
            <Row withoutSideMargin>
              <Col xs>
                <Card title={t('in-events:titleMetrics')}>
                  <EventChart event={event} />
                </Card>
              </Col>
            </Row>
          )}
          {hasMetric(event, 'cpu.user') && (
            <Row withoutSideMargin>
              <Col xs>
                <ProcessContent snapshot={snapshot} timeConfig={timeConfig} />
              </Col>
            </Row>
          )}
        </>
      )}
      {isIssue && isIbmMqFileTransferIssueEvent(event) && (
        <Row withoutSideMargin>
          <Col xs>
            <IbmMqFileTransferMetadataTable
              ibmMqFileTransferMetadata={event?.getIn(['metadata', 'ibmMqFileTransfer'], emptyList)?.toJS() ?? []}
            />
          </Col>
        </Row>
      )}

      {isIssue && hasEventSpec && (
        <AutomationCard volatileId={snapshot?.get('volatileId')?.toJS() ?? {}} event={event?.toJS()} />
      )}
      <ImpactedBusinessProcesses
        eventType={eventType}
        entityType={event?.get('entityType', undefined)}
        entityId={event?.get('entityId', undefined)}
      />
      {isCveIssueEvent(event) && snapshot?.get('id') && (
        <AffectedEntitiesPresenter id={snapshot?.get('id')} timeConfig={timeConfig} />
      )}
    </>
  );
}

const EventActions = ({ event, reload, latestSnapshot }) => {
  const canCloseManually = role?.canManuallyCloseIssue;
  const timeConfig = getTimeConfigForSnapshotRetrieval(event, latestSnapshot);

  return (
    <Stack gap="xxsmall">
      {canCloseManually && hasManualCloseFields(event) && <ManualCloseDescription event={event} />}
      <DescriptionButtons>
        {canCloseManually && (
          <ManualCloseIssueButton
            event={event}
            reload={reload}
            iconComponent={
              <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />
            }
          />
        )}
        <TriggeredIncidentButton event={event} />
        <EventSpecificationLink event={event.toJS()} />
        {aqmDisableConfigOnEventViewEnabled && (
          <DisableEventConfigButton event={event} eventType="event" reload={reload} />
        )}
        <AnalyzeIssueCallsButton event={event} />
      </DescriptionButtons>
    </Stack>
  );
};

function ProcessContent({ snapshot, timeConfig }) {
  if (!snapshot || (snapshot.progress && snapshot.progress.loading)) {
    return <LoadingIndicator inline type="dark" style={{ height: '16px' }} />;
  }
  return <ProcessTopList snapshot={snapshot} timeConfig={timeConfig} />;
}

function hasMetric(event, metric) {
  return event.getIn(['metadata', 'metrics'], emptyList).filter(e => e.get('metricName') === metric).size > 0;
}

function hasAtLeastOneMetric(event) {
  return event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}

function getLatestSnapshot(snapshotVersions) {
  return snapshotVersions.sort((a, b) => a.get('to') - b.get('to')).pop();
}

function getSnapshotVersionsObservable([expiredSnapshotId]) {
  return expiredSnapshotId && getSnapshotVersions(expiredSnapshotId);
}
