/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import StackTrace, {
  StackTraceFormatter
} from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import { MobileAppMonitoringBeacon } from 'in-types';
import { t } from 'in-i18n';

import locals from './Stack.mless';

export default function Stack({ beacon }: { beacon: MobileAppMonitoringBeacon }) {
  const formatter: StackTraceFormatter = beacon.platform === 'iOS' ? 'ios-translated-dump' : 'java-stacktrace-alike';
  return (
    <StackTrace formatter={formatter} stackTrace={beacon.stackTrace}>
      {({ actions, content }) => (
        <Fragment>
          <div className={locals.header}>
            <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumCrashBeacon.stackTrace')}</BodyHeader>
            <div className={locals.actions}>{actions}</div>
          </div>
          {content}
        </Fragment>
      )}
    </StackTrace>
  );
}
