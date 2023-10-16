/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Typography } from '@instana/components';

import {
  track,
  PLAY_WITH_BOOK_DEMO_NOW_BUTTON_CLICKED,
  PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED
} from 'in-services/tracking/tracking';
import { playwithEnabled } from 'in-services/featureFlags';
import Sticky from 'in-components/Sticky/Sticky';
import { t } from 'in-i18n';

import locals from './PlayWithHeader.mless';

export function getPageType(pathname = '/') {
  const pageName = pathname.split('/')[1];

  switch (pageName) {
    case 'physical':
      return { pageName: 'Infrastructure' };
    case 'websiteMonitoring':
      return { pageName: 'EUM' };
    case 'config':
      return { pageName: 'Settings' };
    case '':
      return { pageName: '--' };
    default:
      return { pageName: pageName.charAt(0).toUpperCase() + pageName.slice(1) };
  }
}

export default function PlayWithHeader() {
  return (
    <Sticky
      header={
        <>
          {playwithEnabled && (
            <div className={locals.playWithInstana}>
              <div className={locals.headerHeading}>
                <Typography onDark variant="heading-600">
                  {t('in-plg:playwithinstana.title')}
                </Typography>
              </div>

              <div className={locals.readyToMonitor}>
                <Typography onDark variant="body-bold">
                  {t('in-plg:playwithinstana.content')}?
                </Typography>
              </div>

              <Button
                id="free_trial"
                kind="secondary"
                size="compact"
                className={locals.buttonFreeTrial}
                target="_blank"
                href="https://www.ibm.com/account/reg/us-en/signup?formid=urx-52048"
                onClick={() => {
                  track(PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED, getPageType(location.pathname));
                }}
              >
                {t('in-plg:playwithinstana.freetrial')}
              </Button>

              <Button
                id="schedule_demo"
                kind="secondary"
                size="compact"
                className={locals.buttonDemo}
                target="_blank"
                href="https://www.instana.com/schedule-demo/"
                onClick={() => {
                  track(PLAY_WITH_BOOK_DEMO_NOW_BUTTON_CLICKED, getPageType(location.pathname));
                }}
              >
                {t('in-plg:playwithinstana.bookdemo')}
              </Button>
            </div>
          )}
        </>
      }
    />
  );
}
