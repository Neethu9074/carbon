/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { t } from 'in-i18n';

export default function UiClientUpdateMessage() {
  return (
    <div>
      <nav>
        <Link href="#" onClick={() => window.location.reload()}>
          {t('in-components:uiClinetUpdateMessage.buttonReloadToUpdate')}
        </Link>
      </nav>
    </div>
  );
}
