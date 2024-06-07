/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';

import { t } from 'in-i18n';

interface Props {
  fixSuggestion: string;
}

export default function ProblemDescription({ fixSuggestion }: Props) {
  return (
    <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
      <Stack>
        <Stack gap="xxsmall">
          <Typography variant="body-bold">{t('in-events:titleDescription')}</Typography>
          <Typography variant="body-regular">{fixSuggestion}</Typography>
        </Stack>
      </Stack>
    </div>
  );
}
