/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonModal } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { createLogger } from '@instana/logger';

import { counter$ } from 'in-components/SessionTimeoutDialog/sessionTimeout';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import http from 'in-services/http';
import { t } from 'in-i18n';

const logger = createLogger('in-components/SessionTimeoutDialog/SessionTimeoutDialog');

const signOut = () => {
  const form = document.createElement('form');
  form.method = 'post';
  form.action = '/auth/signOut';
  document.body.appendChild(form);
  form.submit();
};

const convertMilliSecondsToTimer = (ms: number) => {
  const date = new Date(ms);
  // this is extracting the time from e.g. 2024-12-02T17:47:23.450Z'
  const formatted = date.toISOString().substr(11, 8);
  return formatted;
};

export default function SessionTimeoutDialog(props: {
  minDuration: number;
  showModel: boolean;
  setShowModel: (flag: boolean) => void;
}) {
  const counter: number | null | undefined = useObservable(counter$, []);
  if (!counter) {
    // to handle undefined counter state
    return null;
  }
  if (counter && counter <= 1000) {
    window.location.reload();
    // reload when the counter finishes.
  }
  if (counter > props.minDuration) {
    return null;
  }

  return (
    <CarbonModal
      size="xs"
      open={props.showModel}
      modalHeading={t('in-components:sessionTimeout.title')}
      primaryButtonText={t('in-components:sessionTimeout.loggedInButton')}
      secondaryButtonText={t('in-components:sessionTimeout.logOutButton')}
      onRequestSubmit={() => {
        http({
          method: 'GET',
          url: '/api/checkUserAccessPermitted'
        }).once(
          () => {
            // Todo : later, remove it when we get an in-time update from the server.
            // Currently, we just refresh the page as the easiest solution to get all things updated,
            // because the session/idle time-out values are updated from server with a delay of
            // up to one minute.
            // see https://jsw.ibm.com/browse/INSTA-31309
            window.location.reload(); // To update with latest
          },
          error => {
            logger.error(`failed to update timeout session: ${error.message}`, error);
            // handling error scenario like env is down.
            addMessage(
              {
                type: 'danger',
                timeout: 5000,
                title: t('in-components:sessionTimeout.failedToUpdateSession'),
                content: ''
              },
              'failedToUpdateSession'
            );
          }
        );
      }}
      onSecondarySubmit={() => {
        signOut();
        props.setShowModel(false);
      }}
      onRequestClose={() => {
        props.setShowModel(false);
      }}
    >
      {t('in-components:sessionTimeout.message') + ' ' + convertMilliSecondsToTimer(counter)}
    </CarbonModal>
  );
}
