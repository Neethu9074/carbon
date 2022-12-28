/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import StackTraceContainer from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/StackTraceContainer';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import { MobileAppMonitoringBeacon } from 'in-types';
import { t } from 'in-i18n';

import locals from './BeaconStack.mless';

export default function BeaconStackTrace({ beacon }: { beacon: MobileAppMonitoringBeacon }) {
  const rawData = beacon.platform === 'iOS';
  return (
    <StackTraceContainer raw={rawData} stackTrace={beacon.stackTrace}>
      {({ actions, content }) => (
        <Fragment>
          <div className={locals.header}>
            <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumCrashBeacon.stackTrace')}</BodyHeader>
            <div className={locals.actions}>{actions}</div>
          </div>
          {content}
        </Fragment>
      )}
    </StackTraceContainer>
  );
}
