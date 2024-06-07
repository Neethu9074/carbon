/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';
import React from 'react';

import { Stack, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import { EventOrMap } from 'in-events/types';

interface Props {
  event: EventOrMap;
}

export default function ManualCloseDescription({ event }: Props) {
  const metadata = event.get('metadata') as Map<string, any>;
  const reasonForClosing = metadata.get('manualCloseReason');
  const username = metadata.get('manualCloseUsername');

  return (
    <Stack>
      <Stack gap="xxsmall">
        <Typography variant="body-bold">{t('in-events:closeEventDialog.closedByLabel')}</Typography>
        <Typography variant="body-regular">{username}</Typography>
      </Stack>
      <Stack gap="xxsmall">
        <Typography variant="body-bold">{t('in-events:closeEventDialog.comments')}</Typography>
        <Typography variant="body-regular">{reasonForClosing}</Typography>
      </Stack>
    </Stack>
  );
}
