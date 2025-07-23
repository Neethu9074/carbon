/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment, useState } from 'react';

import { MobileAppMonitoringBeacon } from '@instana/types';

import StackTraceContainer from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/StackTraceContainer';
import { formatStackTrace } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/BeaconStackParser';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import { t } from 'in-i18n';

import locals from './BeaconStack.mless';

export default function BeaconStackTrace({
  beacon,
  optionalLabel
}: {
  beacon: MobileAppMonitoringBeacon;
  optionalLabel?: boolean;
}) {
  const [pretty, setPretty] = useState(true);

  const formatedData = formatStackTrace(beacon, pretty);
  return (
    <StackTraceContainer data={formatedData} pretty={pretty} onChange={pretty => setPretty(pretty)}>
      {({ actions, content }) => (
        <Fragment>
          <div className={locals.header}>
            <BodyHeader>
              {optionalLabel
                ? t('in-mobile-apps:sessionView.tabsSumCrashBeacon.stackTraceLastOccurrence')
                : t('in-mobile-apps:sessionView.tabsSumCrashBeacon.stackTrace')}
            </BodyHeader>
            <div className={locals.actions}>{actions}</div>
          </div>
          {content}
        </Fragment>
      )}
    </StackTraceContainer>
  );
}
