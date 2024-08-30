/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Table, Th, Thead, Td, Tbody, Tr } from '@instana/legacy';

import HighlightedTimeframeMarkerRow from 'in-events/components/HighlightedTimeframeMarkerRow';
import EntityPageMainNotification from 'in-components/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { t } from 'in-i18n';

import locals from './EmptyEventsList.mless';

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

function getHeaders(eventType) {
  if (eventType === 'cve_issue') {
    return (
      <Tr size="compact">
        <Th>{t('in-events:headerVulnerability')}</Th>
        <Th>{t('in-events:headerReportedOn')}</Th>
        <Th>{t('in-events:headerReportedDate')}</Th>
        <Th>{t('in-events:headerAffectedApp')}</Th>
        <Th>{t('in-events:headerCvssScore')}</Th>
        <Th>{t('in-events:headerStatus')}</Th>
      </Tr>
    );
  }

  return (
    <Tr size="compact">
      <Th>{t('in-events:headerTitle')}</Th>
      <Th>{t('in-events:headerStarted')}</Th>
      <Th>{t('in-events:headerEnd')}</Th>
      <Th>{t('in-events:headerOn')}</Th>
    </Tr>
  );
}

export default function EventsList({ eventType, cols, isDenseList, isPresentingHighlightedTimeframe }) {
  if (isDenseList) {
    return (
      <Table>
        <Thead>
          <Tr size="compact">
            <Th>{t('in-events:headerStarted')}</Th>
          </Tr>
        </Thead>
        <Tbody />
      </Table>
    );
  }

  const entityType = translateEventType(eventType);
  const headers = getHeaders(eventType);
  return (
    <Table>
      <Thead>{headers}</Thead>
      <Tbody>
        {isPresentingHighlightedTimeframe && <HighlightedTimeframeMarkerRow cols={cols} />}
        <Tr className={locals.row}>
          <Td colSpan={cols}>
            <CenterAlignmentColumn>
              <EntityPageMainNotification
                title={t('in-events:titleEmptyEvents', { context: entityType })}
                icon="lib_missing_data"
                explanation={t('in-events:explanationEmptyEvents', { context: entityType })}
              />
            </CenterAlignmentColumn>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
