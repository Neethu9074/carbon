/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Typography } from '@instana/components';

import { playwithEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import locals from './PlayWithHeader.mless';

export default function PlayWithHeader() {
  const playwitHeaderClass = playwithEnabled ? locals.playWithInstana : locals.playWitHeaderClassDisable;

  return (
    <div className={playwitHeaderClass}>
      <div className={locals.headerHeading}>
        <Typography variant="heading-600">{t('in-new-components:playwithinstana.title')}</Typography>
      </div>

      <div className={locals.readyToMonitor}>
        <Typography variant="body-bold">{t('in-new-components:playwithinstana.content')}?</Typography>
      </div>

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
        {t('in-new-components:playwithinstana.freetrial')}
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
        {t('in-new-components:playwithinstana.bookdemo')}
      </Button>
    </div>
  );
}
