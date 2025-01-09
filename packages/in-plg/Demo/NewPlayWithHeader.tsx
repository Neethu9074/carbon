/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import ShareAndInviteDialogBox from 'promise-loader?global,shareAndInvite!in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import classNames from 'classnames';
import React from 'react';

import { LicenseBannerButton, Typography } from '@instana/components';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import {
  PLAY_WITH_BOOK_DEMO_NOW_BUTTON_CLICKED,
  PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED
} from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Tooltip from 'in-components/Tooltip/Tooltip';
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

const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);

export default function NewPlayWithHeader() {
  const location = useLocation();
  const { trackCta } = useSegmentTracking();
  return (
    <div className={classNames(locals.newPlayWithInstana)}>
      <span className={classNames(locals.message)}>
        <Typography onDark variant="body-regular">
          {t('in-plg:playwithinstana.content')}?
        </Typography>
      </span>
      <LicenseBannerButton
        className={classNames(locals.bannerButton)}
        id="free_trial"
        kind="primary"
        target="_blank"
        href="https://www.ibm.com/account/reg/us-en/signup?formid=urx-52345&utm_source=playwith"
        onClick={() => {
          trackCta(PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED, getPageType(location.pathname));
        }}
        icon="lib_arrow_up_right"
      >
        {t('in-plg:playwithinstana.freetrial')}
      </LicenseBannerButton>
      <LicenseBannerButton
        className={classNames(locals.bannerButton)}
        id="schedule_demo"
        kind="ghost"
        target="_blank"
        href="https://www.ibm.com/account/reg/us-en/subscribe?formid=DEMO-automateinstana&utm_source=playwith"
        onClick={() => {
          trackCta(PLAY_WITH_BOOK_DEMO_NOW_BUTTON_CLICKED, getPageType(location.pathname));
        }}
        icon="lib_demo"
      >
        {t('in-plg:playwithinstana.bookdemo')}
      </LicenseBannerButton>
      <Tooltip align="bottomRight" content={t('in-plg:licenseBanner.shareTooltip')}>
        <LicenseBannerButton
          id="shareButton"
          kind="ghost"
          icon="lib_actions_share"
          iconColor="var(--cds-link-primary)"
          target="_blank"
          onClick={() => addActiveDialog(<DeferredShareAndInviteDialogBox />)}
        >
          {t('in-plg:licenseBanner.share')}
        </LicenseBannerButton>
      </Tooltip>
      <div className={locals.verticalLine} />
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
