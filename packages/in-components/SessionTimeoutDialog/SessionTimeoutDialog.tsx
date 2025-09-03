/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonModal, Typography, Stack } from '@instana/components';
import { InlineNotification } from '@instana/carbon';
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
  const formatted = date.toISOString().substr(14, 5);

  return formatted;
};

export default function SessionTimeoutDialog(props: {
  minDuration: number;
  showModel: boolean;
  setShowModel: (flag: boolean) => void;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
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
      size="sm"
      open={props.showModel}
      modalHeading={t('in-components:sessionTimeout.title')}
      primaryButtonText={t('in-components:sessionTimeout.loggedInButton')}
      loadingStatus={isLoading ? 'active' : 'inactive'}
      loadingDescription={t('in-components:sessionTimeout.loading')}
      secondaryButtonText={t('in-components:sessionTimeout.logOutButton')}
      onRequestSubmit={() => {
        setIsLoading(true);
        http({
          method: 'GET',
          url: '/api/checkUserAccessPermitted'
        }).once(
          () => {
            addMessage(
              {
                title: t('in-components:sessionTimeout.successUpdateSessionTitle'),
                type: 'success',
                icon: 'success',
                content: t('in-components:sessionTimeout.successUpdateSessionDescription')
              },
              'ui-update-notification'
            );
            // Todo : later, remove it when we get an in-time update from the server.
            // Currently, we just refresh the page as the easiest solution to get all things updated,
            // because the session/idle time-out values are updated from server with a delay of
            // up to one minute.
            // see https://jsw.ibm.com/browse/INSTA-31309
            setIsLoading(false);
            window.location.reload(); // To update with latest
          },
          error => {
            setIsLoading(false);
            setIsError(true);
            const errorMessage = error.message || t('in-components:sessionTimeout.failedToUpdateSession');
            logger.error(`failed to update timeout session: ${errorMessage}`, error);
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
      <Stack gap="xsmall">
        <Typography variant="body-regular">{t('in-components:sessionTimeout.message')}</Typography>
        <Typography variant="heading-03">{`${convertMilliSecondsToTimer(counter)} minutes`}</Typography>

        {isError && (
          <InlineNotification
            title={t('in-components:sessionTimeout.failedToUpdateSession')}
            kind="error"
            hideCloseButton
            lowContrast
          />
        )}
      </Stack>
    </CarbonModal>
  );
}
