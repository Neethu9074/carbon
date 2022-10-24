/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import StackTrace from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import { t } from 'in-i18n';

import locals from './Stack.mless';

export default function Stack({ beacon }) {
  return (
    <StackTrace stackTrace={beacon.stackTrace}>
      {({ content }) => (
        <Fragment>
          <div className={locals.header}>
            <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumCrashBeacon.stackTrace')}</BodyHeader>
          </div>
          {content}
        </Fragment>
      )}
    </StackTrace>
  );
}
