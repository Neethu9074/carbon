/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack, Button } from '@instana/components';

import ChooseConnectionStrategyDialog from 'in-connection/components/ChooseConnectionStrategyDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

export interface Props {
  attempt: number;
}

export default function ReconnectingMessage({ attempt }: Props) {
  return (
    <Stack align="start" gap="xsmall">
      {t('in-connection:stat.connectLostState.connectingMsg', { connectAttempt: attempt })}
      {attempt >= 3 && (
        <Button
          size="compact"
          kind="tertiary"
          style={{ paddingInlineEnd: '1rem' }}
          onClick={e => {
            // do not close the fly-in message
            e.stopPropagation();
            addActiveDialog(<ChooseConnectionStrategyDialog />);
          }}
        >
          {t('in-connection:stat.connectLostState.chooseConnectionStrategy')}
        </Button>
      )}
    </Stack>
  );
}
