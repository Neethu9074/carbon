/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Typography } from '@instana/components';

import { playwithEnabled } from 'in-services/featureFlags';
import Sticky from 'in-components/Sticky/Sticky';
import { t } from 'in-i18n';

import locals from './PlayWithHeader.mless';

export default function PlayWithHeader() {
  return (
    <Sticky
      header={
        playwithEnabled ? (
          <div className={locals.playWithInstana}>
            <div className={locals.headerHeading}>
              <Typography onDark variant="heading-600">
                {t('in-new-components:playwithinstana.title')}
              </Typography>
            </div>

            <div className={locals.readyToMonitor}>
              <Typography onDark variant="body-bold">
                {t('in-new-components:playwithinstana.content')}?
              </Typography>
            </div>

            <Button
              id="free_trial"
              kind="secondary"
              size="compact"
              className={locals.buttonFreeTrial}
              target="_blank"
              href="https://www.instana.com/trial/"
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
            >
              {t('in-new-components:playwithinstana.bookdemo')}
            </Button>
          </div>
        ) : (
          <></>
        )
      }
    />
  );
}
