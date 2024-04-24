/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Select } from '@instana/components';
import { Stack } from '@instana/components';

import { activeStrategy, setStrategy, ConnectionStrategy } from 'in-connection/strategy';
import { close, addActiveDialog } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import CancelButton from 'in-components/form/CancelButton';
import SaveButton from 'in-components/form/SaveButton';
import FormGroup from 'in-components/form/FormGroup';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';
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
              <option value={'auto'}>{t('in-connection:strategy', { context: 'auto' })}</option>
              <option value={'alwaysWebsockets'}>{t('in-connection:strategy', { context: 'alwaysWebsockets' })}</option>
              <option value={'alwaysPolling'}>{t('in-connection:strategy', { context: 'alwaysPolling' })}</option>
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
