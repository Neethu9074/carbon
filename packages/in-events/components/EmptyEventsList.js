/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HighlightedTimeframeMarkerRow from 'in-events/components/HighlightedTimeframeMarkerRow';
import { Table, Th, Thead, Td, Tbody, Tr } from 'in-components/tables/sharedComponents';
import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification';
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
    default:
      return eventType;
  }
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
  return (
    <Table>
      <Thead>
        <Tr size="compact">
          <Th>{t('in-events:headerTitle')}</Th>
          <Th>{t('in-events:headerStarted')}</Th>
          <Th>{t('in-events:headerEnd')}</Th>
          <Th>{t('in-events:headerOn')}</Th>
        </Tr>
      </Thead>
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
