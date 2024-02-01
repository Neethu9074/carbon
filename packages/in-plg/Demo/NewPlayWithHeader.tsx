/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { LicenseBannerButton, Typography } from '@instana/components';

import {
  track,
  PLAY_WITH_BOOK_DEMO_NOW_BUTTON_CLICKED,
  PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED
} from 'in-services/tracking/tracking';
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

export default function NewPlayWithHeader() {
  return (
    <div className={classNames('g10', locals.newPlayWithInstana)}>
      <Typography onDark variant="body-regular">
        {t('in-plg:playwithinstana.content')}?
      </Typography>

      <LicenseBannerButton
        id="free_trial"
        kind="primary"
        target="_blank"
        href="https://www.ibm.com/account/reg/us-en/signup?formid=urx-52048"
        onClick={() => {
          track(PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED, getPageType(location.pathname));
        }}
        icon="lib_arrow_short_right"
      >
        {t('in-plg:playwithinstana.freetrial')}
      </LicenseBannerButton>

      <LicenseBannerButton
        id="schedule_demo"
        kind="ghost"
        target="_blank"
        href="https://www.instana.com/schedule-demo/"
        onClick={() => {
          track(PLAY_WITH_BOOK_DEMO_NOW_BUTTON_CLICKED, getPageType(location.pathname));
        }}
      >
        {t('in-plg:playwithinstana.bookdemo')}
      </LicenseBannerButton>
      <LicenseBannerButton
        id="take_tour"
        kind="ghost"
        target="_blank"
        href="https://www.instana.com/schedule-demo/"
        icon="lib_crossroads"
        iconColor="var(--cds-button-primary)"
      >
        {t('in-plg:playwithinstana.taketour')}
      </LicenseBannerButton>
    </div>
  );
}
