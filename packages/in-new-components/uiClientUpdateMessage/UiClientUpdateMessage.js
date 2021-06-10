/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { t } from 'in-i18n';

import locals from './UiClientUpdateMessage.mless';

export default function UiClientUpdateMessage() {
  return (
    <div className={locals.container}>
      <h1 className={locals.title}>{t('in-components:uiClinetUpdateMessage.newVersionOfInstanaAvailable')}</h1>
      <nav className={locals.controls}>
        <Button kind="action" onClick={() => window.location.reload()}>
          {t('in-components:uiClinetUpdateMessage.buttonReloadToUpdate')}
        </Button>
      </nav>
    </div>
  );
}
