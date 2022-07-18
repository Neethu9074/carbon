/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import { get } from 'lodash';

import { Button } from '@instana/components';

import config from 'in-services/config';

/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */
import locals from './MigratedTenantBanner.mless';

export default function MigratedTenantBanner() {
  const migratedTenantUnitUrl = get(config, ['configuration', 'migratedTenantUnitUrl'], '');
  const [active, setActive] = useState(migratedTenantUnitUrl !== '');

  return active ? (
    <div className={locals.migratedTenantBanner}>
      <h1 className={locals.headerHeading}>Migrated Tenant Unit</h1>

      <p className={locals.migrationNotice}>
        <b>
          This tenant unit has been migrated to a new region. The unit you are currently accessing only contains
          historical data.
        </b>
      </p>

      <Button
        kind="secondary"
        size="compact"
        className={locals.buttonGoto}
        target="_blank"
        href={migratedTenantUnitUrl}
      >
        Go to New Location
      </Button>

      <Button kind="secondary" size="compact" onClick={() => setActive(false)}>
        Explore Historical Data
      </Button>
    </div>
  ) : (
    <></>
  );
}
