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
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { CTA_CLICKED } from 'in-services/util/constants';
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
    <div className={classNames(locals.newPlayWithInstana)}>
      <span className={classNames(locals.message)}>
        <Typography onDark variant="body-regular">
          {t('in-plg:playwithinstana.content')}?
        </Typography>
      </span>
      <LicenseBannerButton
        id="free_trial"
        kind="primary"
        target="_blank"
        href="https://www.ibm.com/account/reg/us-en/signup?formid=urx-52345&utm_source=playwith"
        onClick={() => {
          eventTracker({
            eventName: CTA_CLICKED,
            parentProductArea: productAreas.home,
            parentPageName: pageNames.home
          });
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
        icon="lib_crossroads"
        iconColor="var(--cds-link-primary)"
      >
        {t('in-plg:playwithinstana.taketour')}
      </LicenseBannerButton>
    </div>
  );
}
