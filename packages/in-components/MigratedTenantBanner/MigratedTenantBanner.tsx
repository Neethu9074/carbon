/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import { get } from 'lodash';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import config from 'in-services/config';

import locals from './MigratedTenantBanner.mless';

export default function MigratedTenantBanner() {
  const migratedTenantUnitUrl = get(config, ['configuration', 'migratedTenantUnitUrl'], '');
  const [active, setActive] = useState(migratedTenantUnitUrl !== '');

  return active ? (
    <div className={locals.migratedTenantBanner}>
      <h1 className={locals.headerHeading}>{t('in-components:migratedTenantBanner.title')}</h1>

      <p className={locals.migrationNotice}>
        <b>{t('in-components:migratedTenantBanner.notice')}</b>
      </p>

      <Button
        kind="secondary"
        size="compact"
        className={locals.buttonGoto}
        target="_blank"
        href={migratedTenantUnitUrl}
      >
        {t('in-components:migratedTenantBanner.goToNewLocationLabel')}
      </Button>

      <Button kind="secondary" size="compact" onClick={() => setActive(false)}>
        {t('in-components:migratedTenantBanner.exploreDataLabel')}
      </Button>
    </div>
  ) : (
    <></>
  );
}
