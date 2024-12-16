/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { Button, CarbonMenuItem, IconButton, SvgIcon } from '@instana/components';
import { interval } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import ManualCloseIssueConfigForm from 'in-events/components/tabs/Summary/ManualCloseIssueConfigForm';
import { hasManualCloseFields } from 'in-events/components/eventUtil';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { EventOrMap } from 'in-events/types';
import { getEvents } from 'in-events/api';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

type ManualCloseIssueButtonProps = {
  event: EventOrMap;
  reload: () => void;
  iconComponent?: React.ReactNode;
  buttonKind?: any;
  eventType?: string;
  buttonType?: 'button' | 'iconButton' | 'menuItem';
};

export default function ManualCloseIssueButton({
  event,
  iconComponent,
  reload,
  buttonKind = 'secondary',
  eventType,
  buttonType = 'button'
}: ManualCloseIssueButtonProps) {
  const [manuallyClosed, setManuallyClosed] = useState<boolean>(false);
  const [eventIDForAfterManualCheck, setEventIDForAfterManualCheck] = useState<string>('');

  const eventDataForAfterManualClosed = useObservable(
    eventIDForAfterManualCheck ? interval(1000).flatMap(() => getEvents([eventIDForAfterManualCheck])) : null,
    [eventIDForAfterManualCheck]
  );

  const hasEventSpec = event.getIn(['metadata', 'eventSpecificationId'], '') !== '';
  const problemText = event.getIn(['problem', 'problemText'], '');
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const state = event.get('state');

  useEffect(() => {
    if (manuallyClosed && (state === 'manually_closed' || state === 'closed')) {
      setManuallyClosed(false);
    } else if (manuallyClosed && !eventIDForAfterManualCheck) {
      setEventIDForAfterManualCheck(event.get('id') as string);
    } else if (manuallyClosed) {
      if (
        eventDataForAfterManualClosed &&
        Array.isArray(eventDataForAfterManualClosed) &&
        eventDataForAfterManualClosed.length > 0
      ) {
        const checkStateFromAPIRequest = eventDataForAfterManualClosed[0]?.state;
        if (checkStateFromAPIRequest === 'manually_closed' || checkStateFromAPIRequest === 'closed') reload();
      }
    }

    return () => {};
  }, [manuallyClosed, state, reload, eventDataForAfterManualClosed, eventIDForAfterManualCheck, event]);

  if (manuallyClosed) {
    return <IconButton type="lib_actions_sync" iconSpinning kind="secondary" disabled />;
  }

  if (!role?.canManuallyCloseIssue || !hasEventSpec) {
    // at the moment the link of this button generally does not work when the canConfigureEventsAndAlerts permission is missing,
    // because we generally hide the Events & Alerts section, including the build-in events.
    return null;
  }

  const handleCloseIssue = () => {
    addActiveDialog(
      <ManualCloseIssueConfigForm
        onSaveSuccess={() => {
          setManuallyClosed(true);
        }}
        event={event}
        problem={problemText || ''}
        description={fixSuggestion || ''}
        iconComponent={iconComponent}
        eventType={eventType}
      />
    );
  };

  const isManuallyClosedButtonDisabled: boolean = state === 'closed' || hasManualCloseFields(event);

  // For incident overview header types
  if (buttonType === 'iconButton') {
    return (
      <IconButton
        type="lib_openclose_cancel"
        kind={buttonKind}
        disabled={isManuallyClosedButtonDisabled}
        iconSize="xs"
        isWrapperedByTooltip
        align="left"
        iconDescription={
          eventType === 'incident'
            ? t('in-events:closeEventDialog.closeIncident')
            : t('in-events:closeEventDialog.closeIssue')
        }
        onClick={handleCloseIssue}
      />
    );
  }

  // for menuButtons
  if (buttonType === 'menuItem') {
    return (
      <CarbonMenuItem
        label={
          eventType === 'incident'
            ? t('in-events:closeEventDialog.closeIncident')
            : t('in-events:closeEventDialog.closeIssue')
        }
        onClick={handleCloseIssue}
        renderIcon={() => <SvgIcon type="lib_openclose_cancel" size="xs" />}
        disabled={isManuallyClosedButtonDisabled}
      />
    );
  }

  return (
    <Button
      kind={buttonKind}
      onClick={handleCloseIssue}
      disabled={isManuallyClosedButtonDisabled}
      icon="lib_openclose_cancel"
      iconSize="xs"
    >
      {eventType === 'incident'
        ? t('in-events:closeEventDialog.closeIncident')
        : t('in-events:closeEventDialog.closeIssue')}
    </Button>
  );
}
