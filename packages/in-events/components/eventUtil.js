/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// FYI this class assumes 'event' is EventOrMap
import React from 'react';

import { Pill } from '@instana/components';

import { getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import { t } from 'in-i18n';

export function isEntityVerificationEvent(event) {
  return event?.hasIn(['metadata', 'entityVerificationSnapshotId']);
}

export function isHostAvailabilityEvent(event) {
  return event?.hasIn(['metadata', 'hostAvailabilitySnapshotId']);
}

export function isWebsiteSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'websiteId']);
}

export function isApplicationSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'applicationId']);
}

export function isInfraSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'infraSmartAlert']);
}

export function isSyntheticSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'syntheticTestId']);
}

export function isAgentMonitoringIssueEvent(event) {
  return event.hasIn(['metadata', 'agent_monitoring_issue']);
}

export function isCveIssueEvent(event) {
  return event.hasIn(['metadata', 'cve_issue']);
}

export function isIbmMqFileTransferIssueEvent(event) {
  return event.hasIn(['metadata', 'ibmMqFileTransfer']);
}

export function isEntityCountVerificationEvent(event) {
  return event.hasIn(['metadata', 'entity_count_verification_event']);
}

export function isMobileAppSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'mobileAppId']);
}

export function isSloSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'sloId']);
}

export function isLogSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'logSmartAlert']);
}

export function hasManualCloseFields(event) {
  return (
    event.hasIn(['metadata', 'manualCloseReason']) &&
    event.hasIn(['metadata', 'manualCloseTimestamp']) &&
    event.hasIn(['metadata', 'manualCloseUsername'])
  );
}

export function getTimeConfigForSnapshotRetrieval(event, latestSnapshot) {
  const timeConfig = getTimeConfigFromEventForSnapshotRetrieval(event);

  if (latestSnapshot) {
    timeConfig.to = latestSnapshot.get('to');
    timeConfig.from = latestSnapshot.get('from');
    timeConfig.windowSize = latestSnapshot.get('to') - latestSnapshot.get('from');
    timeConfig.focusedMoment = latestSnapshot.get('to') - timeConfig.windowSize / 2;
    timeConfig.autoRefresh = false;
  }
  return timeConfig;
}

export function getSnapshotId(event, entityVerification) {
  return entityVerification
    ? event?.getIn(['metadata', 'entityVerificationSnapshotId'], '')
    : event?.getIn(['metadata', 'hostAvailabilitySnapshotId'], '');
}

export function getEventStateBadge(event) {
  if (hasManualCloseFields(event)) {
    return <Pill type="green">{t('in-events:stateManuallyClosed')}</Pill>;
  } else if (event.get('state') === 'closed') {
    return <Pill type="green">{t('in-events:labelClosed')}</Pill>;
  }
}
