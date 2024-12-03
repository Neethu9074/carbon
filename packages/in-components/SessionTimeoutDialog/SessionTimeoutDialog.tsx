/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { CarbonModal } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { counter$ } from 'in-components/SessionTimeoutDialog/sessionTimeout';
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

export default function SessionTimeoutDialog(props: { minDuration: number }) {
  const counter: number | null | undefined = useObservable(counter$, []);

  const [showModel, setShowModel] = useState(true);

  if (counter === 0) {
    signOut(); // logout when the counter finishes.
  }
  if (!counter) {
    // to handle undefined counter state
    return null;
  }
  if (counter > props.minDuration) {
    return null;
  }

  return (
    <CarbonModal
      size="xs"
      open={showModel}
      modalHeading={t('in-components:sessionTimeout.title')}
      primaryButtonText={t('in-components:sessionTimeout.loggedInButton')}
      secondaryButtonText={t('in-components:sessionTimeout.logOutButton')}
      onRequestSubmit={() => {
        setShowModel(false);
      }}
      onSecondarySubmit={() => {
        signOut();
        setShowModel(false);
      }}
      onRequestClose={() => {
        setShowModel(false);
      }}
    >
      {t('in-components:sessionTimeout.message') + ' ' + convertMilliSecondsToTimer(counter)}
    </CarbonModal>
  );
}
