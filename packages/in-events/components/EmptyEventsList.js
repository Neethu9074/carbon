/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { t } from 'in-i18n';

function translateEventType(eventType) {
  if (!eventType) {
    return 'event';
  }

  switch (eventType) {
    case 'agent_monitoring_issue':
      return 'monitoringIssue';
    case 'cve_issue':
      return 'cveIssue';
    default:
      return eventType;
  }
}

function getCarbonHeaders(eventType) {
  if (eventType === 'cve_issue') {
    return [
      { key: 'vulnerability', header: t('in-events:headerVulnerability') },
      { key: 'reportedOn', header: t('in-events:headerReportedOn') },
      { key: 'reportedDate', header: t('in-events:headerReportedDate') },
      { key: 'cvssScore', header: t('in-events:headerCvssScore') },
      { key: 'status', header: t('in-events:headerStatus') }
    ];
  }

  return [
    { key: 'title', header: t('in-events:headerTitle') },
    { key: 'started', header: t('in-events:headerStarted') },
    { key: 'end', header: t('in-events:headerEnd') },
    { key: 'on', header: t('in-events:headerOn') }
  ];
}

export default function EventsList({ eventType, isDenseList }) {
  if (isDenseList) {
    const headers = [{ key: 'started', header: t('in-events:headerStarted') }];
    const rows = [];
    return <CarbonDataTable headers={headers} rows={rows} isSearchEnabled={false} />;
  }

  const carbonHeaders = getCarbonHeaders(eventType);
  const entityType = translateEventType(eventType);

  return (
    <>
      <CarbonDataTable headers={carbonHeaders} rows={[]} isSearchEnabled={false} />
      <CenterAlignmentColumn>
        <EntityPageMainNotification
          title={t('in-events:titleEmptyEvents', { context: entityType })}
          icon="lib_missing_data"
          explanation={t('in-events:explanationEmptyEvents', { context: entityType })}
        />
      </CenterAlignmentColumn>
    </>
  );
}
