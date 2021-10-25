/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Stack } from '@instana/components';

// @ts-expect-error Not yet translated
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
// @ts-expect-error Not yet translated
import CancelButton from 'in-components/form/CancelButton';
// @ts-expect-error Not yet translated
import FormGroup from 'in-components/form/FormGroup';
// @ts-expect-error Not yet translated
import Actions from 'in-components/Dialog/Actions';
import { activeStrategy, setStrategy, ConnectionStrategy } from 'in-connection/strategy';
// @ts-expect-error Not yet translated
import Dialog from 'in-components/Dialog/Dialog';
// @ts-expect-error Not yet translated
import Select from 'in-components/form/Select';
import { close, addActiveDialog } from 'in-components/DialogPresenter/store';
import SaveButton from 'in-components/form/SaveButton';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './ChooseConnectionStrategyDialog.mless';

export default function ChooseConnectionStrategyDialog() {
  const [connectionStrategy, setConnectionStrategy] = useState<ConnectionStrategy>(activeStrategy);

  return (
    <Dialog className={locals.dialog} title={t('in-connection:chooseConnectionStrategyDialog.title')} onClose={close}>
      <form
        onSubmit={e => {
          e.preventDefault();
          setStrategy(connectionStrategy);

          close();
          addActiveDialog(
            <ConfirmationDialog
              header={t('in-connection:chooseConnectionStrategyDialog.confirmReloadTitle')}
              description={t('in-connection:chooseConnectionStrategyDialog.confirmReloadDescription')}
              confirmButtonLabel={t('in-connection:chooseConnectionStrategyDialog.confirmReloadButtonLabel')}
              onSubmit={() => {
                window.location.reload();
              }}
            />
          );
        }}
      >
        <Stack gap="medium">
          <p className={locals.description}>{t('in-connection:chooseConnectionStrategyDialog.description')}</p>

          <FormGroup withoutBottomMargin>
            <Label htmlFor="connection-strategy">{t('in-connection:chooseConnectionStrategyDialog.label')}</Label>
            <Select
              id="connection-strategy"
              value={connectionStrategy}
              onChange={(e: any) => setConnectionStrategy(e.target.value)}
              autoFocus
            >
              <StrategyOption strategy="auto" />
              <StrategyOption strategy="alwaysWebsockets" />
              <StrategyOption strategy="alwaysPolling" />
            </Select>
          </FormGroup>

          <Actions noVerticalMargin>
            <CancelButton onClick={close} />
            <SaveButton>{t('in-connection:chooseConnectionStrategyDialog.save')}</SaveButton>
          </Actions>
        </Stack>
      </form>
    </Dialog>
  );
}

interface StrategyOptionProps {
  strategy: ConnectionStrategy;
}

function StrategyOption({ strategy }: StrategyOptionProps) {
  return <option value={strategy}>{t('in-connection:strategy', { context: strategy })}</option>;
}
