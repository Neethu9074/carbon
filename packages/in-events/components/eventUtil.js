/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';

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

export function isAgentMonitoringIssueEvent(event) {
  return event.hasIn(['metadata', 'agent_monitoring_issue']);
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
