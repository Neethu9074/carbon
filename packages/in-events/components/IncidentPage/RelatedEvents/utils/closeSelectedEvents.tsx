/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import MultiCloseIssueConfigForm from 'in-events/components/MultiCloseIssueConfigForm';
import FailedIncidentsList from 'in-events/components/FailedIncidentsList';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

type EVENT_KINDS = 'issue' | 'incident' | 'change' | 'agent_monitoring_issue' | 'prc_issue' | undefined;

/**
 * Function to give a notice of confirmation and close the issues or incidents given the selected rows
 * @param eventType type of event
 * @param selectedFlatRows ids of selected events
 */
const closeSelectedEvents = (eventType: EVENT_KINDS, selectedRowIds: string[]) => {
  addActiveDialog(
    <MultiCloseIssueConfigForm
      onSaveSuccess={() => {
        addMessage({
          type: 'success',
          timeout: 5000,
          title:
            eventType === 'incident'
              ? t('in-events:multiClose.incidentsCloseSuccessTitle')
              : t('in-events:multiClose.issuesCloseSuccessTitle'),
          content: (
            <div>
              <p>
                {selectedRowIds.length > 1
                  ? eventType === 'incident'
                    ? t('in-events:multiClose.multipleIncidentsCloseSuccessMessage', {
                        count: selectedRowIds.length
                      })
                    : t('in-events:multiClose.multipleIssuesCloseSuccessMessage', { count: selectedRowIds.length })
                  : eventType === 'incident'
                  ? t('in-events:multiClose.singleCloseIncidentSuccessMessage')
                  : t('in-events:multiClose.singleCloseIssueSuccessMessage')}
              </p>
            </div>
          )
        });

        // manually change the state of closed ids

        setTimeout(() => {
          // TODO: reload function from prop is not working
          window.location.reload();
        }, 2000);
      }}
      eventIds={selectedRowIds}
      eventType={eventType}
      onSaveError={failedEvents => {
        addMessage({
          type: 'danger',
          title:
            eventType === 'incident'
              ? t('in-events:multiClose.incidentsCloseUnsuccessTitle')
              : t('in-events:multiClose.issuesCloseUnsuccessTitle'),
          content: (
            <div>
              <p>
                {failedEvents.length > 1
                  ? eventType === 'incident'
                    ? t('in-events:multiClose.multipleIncidentsCloseMessageUnsuccessful', {
                        count: failedEvents.length
                      })
                    : t('in-events:multiClose.multipleIssuesCloseMessageUnsuccessful', { count: failedEvents.length })
                  : eventType === 'incident'
                  ? t('in-events:multiClose.singleIncidentCloseMessageUnsuccessful')
                  : t('in-events:multiClose.singleIssueCloseMessageUnsuccessful')}
              </p>
              <Button
                kind="tertiary"
                size="compact"
                onClick={() =>
                  addActiveDialog(
                    <FailedIncidentsList
                      failedEventIds={failedEvents}
                      eventType={eventType}
                      eventIds={selectedRowIds}
                    />
                  )
                }
              >
                {t('in-events:multiClose.viewUnsuccessfulEventsList')}
              </Button>
            </div>
          )
        });
      }}
    />
  );
};

export default closeSelectedEvents;
