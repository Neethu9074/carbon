/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonModal } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { counter$ } from 'in-components/SessionTimeoutDialog/sessionTimeout';
import { getUserInfo } from 'in-settings/api/userProfile';
import { t } from 'in-i18n';

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
        getUserInfo();
        props.setShowModel(false);
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
