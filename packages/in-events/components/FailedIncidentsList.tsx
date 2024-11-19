/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonTable, CarbonTableBody, CarbonTableCell, CarbonTableRow, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
//@ts-expect-error
import EventIcon from 'in-events/components/EventIcon';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { close } from 'in-components/DialogPresenter/store';
import { toHtml } from 'in-services/formatters/markdown';
import { eventsPath } from 'in-events/navigation/paths';
import { getEvents } from 'in-events/api';
import { t } from 'in-i18n';

import locals from './EventsList.mless';

interface FailedIncidentsListProps {
  failedEventIds: string[];
  eventType?: string;
  eventIds: string[];
}

export default function FailedIncidentsList({ failedEventIds, eventType, eventIds }: FailedIncidentsListProps) {
  const dialogTitle =
    eventType === 'incident'
      ? t('in-events:multiClose.titleFailtoCloseIncidents')
      : t('in-events:multiClose.titleFailtoCloseIssues');

  const failedEvents = useObservable(getEvents(failedEventIds), [failedEventIds]);

  const { location, navigate } = useNavigation();

  if (!failedEvents) {
    return <LoadingIndicator />;
  }

  const onItemClick = (eventId: string) => {
    setOrDeleteMatrixKey(location, eventsPath, 'eventId', eventId);
    navigate(location);
    close();
  };

  return (
    <DialogWithSlideInView title={dialogTitle} onClose={close}>
      <Stack>
        <Stack gap="xxsmall">
          <DangerousHtmlPresenter
            html={toHtml(
              eventIds.length - failedEventIds.length > 1
                ? eventType === 'incident'
                  ? t('in-events:multiClose.multiFailedCloseIncidentsDescription', {
                      total_incidents: eventIds.length,
                      number_incidents_succesfully_closed: eventIds.length - failedEventIds.length,
                      number_incidents_failed_closed: failedEventIds.length
                    })
                  : t('in-events:multiClose.multiFailedCloseIssuesDescription', {
                      total_issues: eventIds.length,
                      number_issues_succesfully_closed: eventIds.length - failedEventIds.length,
                      number_issues_failed_closed: failedEventIds.length
                    })
                : eventType === 'incident'
                ? t('in-events:multiClose.singleFailedCloseIncidentDescription', {
                    total_incidents: eventIds.length,
                    number_incidents_failed_closed: failedEventIds.length
                  })
                : t('in-events:multiClose.singleFailedCloseIssueDescription', {
                    total_issues: eventIds.length,
                    number_issues_failed_closed: failedEventIds.length
                  })
            )}
          />
        </Stack>

        <div className={locals.failedEventTable}>
          <Stack>
            <CarbonTable>
              <CarbonTableBody>
                {failedEvents.map(event => (
                  <CarbonTableRow
                    style={{ cursor: 'pointer' }}
                    // @ts-expect-error
                    key={event.eventId}
                    // @ts-expect-error
                    onClick={() => onItemClick(event.eventId)}
                  >
                    <CarbonTableCell>
                      <EventIcon
                        event={event}
                        // @ts-expect-error
                        tooltipLabel={getEventSeverityLabelWithEventType(event, getTimeConfigFromEvent(event))}
                      />
                    </CarbonTableCell>
                    <CarbonTableCell>
                      {/* @ts-expect-error */}
                      <div title={event.problem}>{event.problem}</div>
                    </CarbonTableCell>
                  </CarbonTableRow>
                ))}
              </CarbonTableBody>
            </CarbonTable>
          </Stack>
        </div>
      </Stack>
    </DialogWithSlideInView>
  );
}
