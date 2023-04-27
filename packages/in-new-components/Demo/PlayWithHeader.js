/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';

import { playwithEnabled } from 'in-services/featureFlags';

import locals from './PlayWithHeader.mless';

export default function PlayWithHeader() {
  const playwitHeaderClass = playwithEnabled ? locals.playWithInstana : locals.playWitHeaderClassDisable;
  return (
    <div className={playwitHeaderClass}>
      <h1 className={locals.headerHeading}>Play with Instana</h1>

      <p className={locals.readyToMonitor}>
        <b>Ready to monitor your own environment?</b>
      </p>
      <Button
        id="free_trial"
        kind="secondary"
        size="compact"
        className={locals.buttonFreeTrial}
        target="_blank"
        href="https://www.instana.com/trial/"
        onClick={() => {
          window._hsq.push([
            'trackEvent',
            {
              id: '000009109797'
            }
          ]);
        }}
      >
        Free trial
      </Button>

      <Button
        id="schedule_demo"
        kind="secondary"
        size="compact"
        className={locals.buttonDemo}
        target="_blank"
        href="https://www.instana.com/schedule-demo/"
        onClick={() => {
          window._hsq.push([
            'trackEvent',
            {
              id: '000009109817'
            }
          ]);
        }}
      >
        Book a demo
      </Button>
    </div>
  );
}
